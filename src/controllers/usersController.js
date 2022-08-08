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
        message: 'Usuario invalido, tente outro!'
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
        message: 'Esse cpf ja esta relacionado a outro usuario!'
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
      token: token,
      typeUser : user.role
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
    
    let user = await User.findOne({
      where: {username: dados.username}
    })
    
    if(!user){
      return res.status(200).send({
        type: 'error',
        message: "Username Invalido"
      })
    }
    
    let name = await User.findOne({
      where: {name: dados.name}
    })
    if(!name){
      return res.status(200).send({
        type: 'error',
        message: "Name Invalido"
      })
    }
    
    let cpf = await User.findOne({
      where: {cpf: dados.cpf}
    })
    if(!cpf){
      return res.status(200).send({
        type: 'error',
        message: "cpf Invalido"
      })
    }
    
    let phone = await User.findOne({
      where: {phone: dados.phone}
    })
    if(!phone){
      return res.status(200).send({
        type: 'error',
        message: "Telefone Invalido"
      })
    }

    if(user.dataValues.username == dados.username  && name.dataValues.username == dados.username   &&
      cpf.dataValues.username == dados.username  && phone.dataValues.username == dados.username) {
        return res.status(200).send({
          type: "success",
          message: `todos os campos coincidem`, 
          data: user.dataValues.id
        })
      } 
      return res.status(200).send({
        type: "error",
        message: `Ocorreu um erro ao atualizar a senha`,
        data: user.dataValues.id
      })
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      data: error.message
    });
  }
}

const newPassword = async (req, res) => {
  try {
    let {password, id} = req.body

    if(!id || !password){
      return res.send({
        type: "error",
        message: `Informe todos os campos para atualizar a nova senha`
      })
    }

    let response = await User.findOne({
      where: {
        id: id
      }
    })

    if(!response) {
      return res.send({
        type: 'error',
        message: "usuario nao encontrado"
      })
    }
    let passwordHash = await bcrypt.hash(password, 10);
    response.passwordHash = passwordHash;
    response.save();

    return res.send({
      type: 'success',
      message: `Senha atualizada com sucesso, faça seu login`
    })

  } catch (error) {
    return res.status(200).send({
      type: 'error',
      data: error.message
    });
  }
}
const validUser = async (req, res) => {
  try {

    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(200).send({
        type: 'error',
        message: 'Token não informado'
      })
    }

    const token = authorization.split(' ')[1] || null;
    const decodedToken = jwt.decode(token);
    
    if (!decodedToken) {
      return res.status(200).send({
        type: 'error',
        message: 'Você não tem permissão para acessar esse recurso!'
      })
    }
    
    if (decodedToken.exp < (Date.now() / 1000)) {
      return res.status(200).send({
        type: 'error',
        message: 'Sua sessão expirou! Faça login novamente'
      })
    }

    const user = await User.findOne({
      where: {
        id: decodedToken.userId
      }
    })

    if (!user) {
      return res.status(200).send({
        type: 'error',
        message: 'Usuário não encontrado'
      })
    }
    if (user.role != 'Admin') {
      return res.status(200).send({
        type: 'error',
        message: 'Você não tem permissão para acessar esse recurso!'
      })
    } 

    return res.status(200).send({
      type: 'success',
      message: `Seja bem vindo ${user.name}`,
      data: user
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
  newPassword,
  validUser
}