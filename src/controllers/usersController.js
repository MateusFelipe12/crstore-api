import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const get = async (req, res) => {
  try {
    let { id } = req.params;
    if(!id){
      const response = await User.findAll({
        order: [['id', 'ASC']]
      });
      if(!response.length){
        return res.send({
          type: 'error',
          message: `Não foi encontrado nenhum registro`
        })
      };
      return res.status(200).send({
        type: 'success', // success, error, warning, info
        message: 'Registros recuperados com sucesso', // mensagem para o front exibir
        data: response // json com informações de resposta
      });
    }

    const response = await User.findOne({
      where: {id}
    });

    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Registros recuperados com sucesso', // mensagem para o front exibir
      data: response // json com informações de resposta
    });

  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data:  error.message
    });
  }
}

const register = async (req, res) => {
  try {
    let { username, name, cpf, phone, password, role } = req.body;

    let userExists = await User.findOne({
      where: {
        username
      }
    });

    if (userExists) {
      return res.status(200).send({
        type: 'error',
        message: 'Não é possivel utilizar esse usuario!'
      });
    }

    userExists = await User.findOne({
      where: {
        cpf
      }
    });

    if (userExists) {
      return res.status(200).send({
        type: 'error',
        message: 'CPF invalido, tente novamente'
      });
    }
    let passwordHash = await bcrypt.hash(password, 10);

    let response = await User.create({
      username,
      name,
      cpf,
      phone,
      passwordHash,
      role
    });

    return res.status(200).send({
      type: 'success',
      message: 'Usuário cadastrastado com sucesso!',
      data: response
    });

  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message
    });
  }
}

const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    console.log(req.body);
    let user = await User.findOne({
      where: {
        username
      }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(200).send({
        type: 'error',
        message: 'Usuário ou senha incorretos!'
      });
    }

    let token = jwt.sign(
      { userId: user.id, username: user.username }, //payload - dados utilizados na criacao do token
      process.env.TOKEN_KEY, //chave PRIVADA da aplicação 
      { expiresIn: '1h' } //options ... em quanto tempo ele expira...
    );

    user.token = token;
    await user.save();

    return res.status(200).send({
      type: 'success',
      message: 'Bem-vindo! Login realizado com sucesso!',
      token,
      typeUser: user.role
    });

  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data:  error.message
    });
  }
}

const update = async (req, res) => {
  try {
    let dados  = req.body;
    const authorization = req.headers.authorization;
    console.log(authorization);
    if (!authorization) {
      return res.status(200).send({
        type: 'error',
        message: 'Token não informado'
      })
    }
    const token = authorization.split(' ')[1] || null;
    const decodedToken = jwt.decode(token);
    
    let response = await User.findOne({
      where: {id: decodedToken.userId}
    })



    Object.keys(response.dataValues).forEach(campo => {
      response[campo] = dados[campo] ? dados[campo] :  response[campo]
    })
    response.save();
    
    return res.status(201).send({
      type: 'success',
      data: response
    })

  } catch (error) {
    return res.status(200).send({
      type: 'error',
      data: error.message
    });
  }
}
export default {
  get,
  register,
  login,
  update,
}