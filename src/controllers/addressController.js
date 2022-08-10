import Address from "../models/Address";
import User from "../models/User";
import jwt from "jsonwebtoken";


const get = async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(200).send({
        type: 'error',
        message: 'Token não informado'
      })
    }
    const token = authorization.split(' ')[1] || null;
    let decodedToken = jwt.decode(token);
    
    if (!decodedToken) {
      return res.status(200).send({
        type: 'error',
        message: 'Você não tem permissão para acessar esse recurso!'
      })
    }
    let id = decodedToken.userId  
    let response = await Address.findAll({
      where: { idUser: id }
    })

    if(!response){
      return res.send({
        type: 'error',
        message: `Não foi encontrado nenhum registro com o id ${id}`
      })
    };

    return res.send({
      type: 'success',
      message: 'Registros recuperados com sucesso', // mensagem para o front exibir
      data: response
    });
  } catch (error) {
    res.send({
      type: 'error',
      message: error.message
    });
  }
}

const persist = async (req, res) => {
  try {
    let {id, city, district, address, complement, number, description} = req.body;
    id = id ? id.toString().replace(/\D/g, '') : null;
    
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(200).send({
        type: 'error',
        message: 'Token não informado'
      })
    }
    const token = authorization.split(' ')[1] || null;
    let decodedToken = jwt.decode(token);
    
    if (!decodedToken) {
      return res.status(200).send({
        type: 'error',
        message: 'Você não tem permissão para acessar esse recurso!'
      })
    }
    let idUser = decodedToken.userId
    let idUserExist = await User.findOne({
      where: {id: idUser}
    })
    if(!idUserExist){
      return res.send({
        type: 'error',
        message: `É necessario informar um usuario valido`
      });
    }
    if(!idUser ||!city || !district || !address ||!complement || !number) {
      return res.send({
        type: 'error',
        message: `É necessario informar todos os campos para adicionar o registro`
      });
    }

    description = description ? description : '';

    // create 
    if(!id){
      let response = await Address.create( { idUser, city, district, address, complement, number, description } );
      return res.send({
      type: 'success',
      data: response 
    });
   }

  //  update 
  let response = await Address.findOne({
    where: {
      id
    }
  });

  if(!response){
    return res.status(400).send({
      type: 'error',
      message:`Nao existe nenhum registro com o id ${id}`
    })
  }

  let dados = req.body
  Object.keys(dados).forEach(campo => response[campo] = dados[campo] )

  await response.save();
  return res.status(201).send({
    type: 'sucess',
    message: `Registro atualizado com sucesso`,
    date: response
  })
  

  } catch (error) {
    return res.send({
      type: 'error',
      message: error.message
    });
  }
}

const destroy = async (req, res) => {
  try {
    let {id} = req.body;
    id = id ? id.toString().replace(/\D/g, '') : null;

    if(!id){
      return res.send({
        type:  "error",
        message: `Informe um id valido`
      })
    }

    let response = await Address.findOne({
      where: { id }
    })
    if(!response){
      return res.send({
        type:  "error",
        message: `Não existe nenhum registro com o id ${id}`
      })
    }
    
    await Address.destroy({
      where: { id }
    })

    return res.send({
      type: "sucess",
      message: `O registro id ${id} foi permanentemente deletado`
    })

  } catch (error) {
    return res.send({
      type: 'error',
      message: error.message
    });
  }
}

export default {
  get,
  persist,
  destroy
}