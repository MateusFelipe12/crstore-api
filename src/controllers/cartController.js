import Cart from "../models/Cart";
import cartRoute from "../routes/cartRoute";

const get = async (req, res) => {
  try {
    let { id } = req.params;
    id = id ? id.toString().replace(/\D/g, '') : null;

    if(!id){
      let response = await Cart.findAll({
        order: [[['id', 'ASC'],]]
      })

      if(!response.length){
        return res.send({
          type: 'error',
          message: `Não foi encontrado nenhum registro`
        })
      };

      return res.send({
        type: 'success',      
        message: 'Registros recuperados com sucesso', 
        data: response
      });
    }

    let response = await Cart.findOne({
      where: { id }
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
    let { items } = req.body;
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(200).send({
        type: 'error',
        message: 'Token não informado'
      })
    }

    const token = authorization.split(' ')[1] || null;
    const decodedToken = jwt.decode(token);
    
    let idUser = decodedToken.idUser

    if(!idUser || !items) {
      return res.send({
        type: 'error',
        message: `É necessario informar todos os campos para adicionar o registro`
      });
    }
    
    let cartUser = await Cart.findOne({
      where: {
        idUser: id
      }
    });
    
    // create 
    if(req.body.update) {
      return res.send({ message:`nan`})
    }
    if(!cartUser){
      let response = await Cart.create( { idUser,  items } );
      return res.send({
      type: 'success',
      data: response
    });
   }

  //  update
   let updateCart = cartUser.toJSON();
   updateCart.quantidade = items.quantidade
   updateCart.quantidade = items.
   console.log(updateCart);
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

export default {
  get,
  persist
}