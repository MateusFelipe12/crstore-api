import Cart from "../models/Cart";
import jwt from "jsonwebtoken";



const get = async (req, res) => {
  try {
    let { id } = req.params;
    // id = id ? id.toString().replace(/\D/g, '') : null;
    if (!id) {
      let response = await Cart.findAll({
        order: [[['id', 'ASC'],]]
      })

      if (response.length < 1) {
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
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(200).send({
        type: 'error',
        message: 'Token não informado'
      })
    }
    const token = authorization.split(' ')[1] || null;
    const decodedToken = jwt.decode(token);

    let idUser = decodedToken.userId

    let response = await Cart.findOne({
      where: { idUser }
    })

    if (!response) {
      return res.send({
        type: 'error',
        message: `voce ainda nao possui itens em seu carrinho :(`
      })
    };

    return res.send({
      type: 'success',
      message: 'Registros recuperados com sucesso', // mensagem para o front exibir
      data: response
    });

  } catch (error) {
    return res.send({
      type: 'error',
      message: error.message
    });
  }
}

const persistCart = async (req, res) => {
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

    let idUser = decodedToken.userId

    if (!idUser || !items) {
      return res.send({
        type: 'error',
        message: `É necessario informar todos os campos para adicionar o registro`
      });
    }

    let cartUser = await Cart.findOne({
      where: {
        idUser: idUser
      }
    });

    // create 
    if (!cartUser) {
      let response = await Cart.create({ idUser, items: [items] });
      return res.send({
        type: 'success',
        data: response
      });
    }

    //  update
    let updateCart = cartUser.toJSON();
    updateCart.items.push(items)
    cartUser.items = updateCart.items
    let response = await cartUser.save()

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
const persistItensCart = async (req, res) => {
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

    let idUser = decodedToken.userId

    if (!idUser || !items) {
      return res.send({
        type: 'error',
        message: `É necessario informar todos os campos para adicionar o registro`
      });
    }

    let cartUser = await Cart.findOne({
      where: {
        idUser: idUser
      }
    });

    if (!cartUser) {
      return res.status(200).send({
        type: 'error',
        message: `Você esta tentando apagar um registro que não exixte, Atualize a pagina`,
      })
    }

    //  update
    cartUser.items = items
    await cartUser.save()

    return res.send({
      type: 'success',
      message: `registro atualizado com sucesso`,
      data: cartUser
    })


  } catch (error) {
    return res.send({
      type: 'error',
      message: error.message
    });
  }
}

const destroyCart = async (req, res) => {
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

    let idUser = decodedToken.userId

    if (!idUser) {
      return res.send({
        type: 'error',
        message: `É necessario informar todos os campos para adicionar o registro`
      });
    }

    let cartUser = await Cart.findOne({
      where: {
        idUser: idUser
      }
    });

    if (!cartUser) {
      return res.status(200).send({
        type: 'error',
        message: `Você esta tentando apagar um registro que não exixte, Atualize a pagina`,
      })
    }

    //  update
    await cartUser.destroy()

    return res.send({
      type: 'success',
      message: `registro deletado com sucesso`,
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
  persistCart,
  persistItensCart,
  destroyCart
}