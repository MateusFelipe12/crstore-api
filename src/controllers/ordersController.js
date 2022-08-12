import { sequelize } from "../config";
import Order from "../models/Order";
import OrderItems from "../models/OrderItems";
import Item from "../models/Item";
import Address from "../models/Address"
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


    if (decodedToken.exp < (Date.now() / 1000)) {
      return res.status(200).send({
        type: 'error',
        message: 'Sua sessão expirou! Faça login novamente'
      })
    }
    let userId = decodedToken.userId
    let response = await Order.findAll({
      where: { idUserCustumer: userId }
    })
    if (!response) {
      return res.send({
        type: 'error',
        message: `Não foi encontrado nenhum registro com o id ${userId}`
      })
    };


    return res.send({
      type: 'success',
      message: 'Registros recuperados com sucesso',
      data: response

    });
  } catch (error) {
    return res.send({
      type: "error",
      message: error.message
    })
  }
}


const persist = async (req, res) => {
  try {
    let { items, addres, payment } = req.body;
    // id = id ? id.toString().replace(/\D/g, '') : null;

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
    let { city, district, address, complement, number, description } = addres
    let response = await Order.create({
      idUserCustumer: idUser,
      city,
      district,
      address,
      complement,
      number,
      IdPaymentMethod: payment,
      description: description,
      Description: description
    })

    let valorTotal = 0
    for (let idItem of items) {
      let item = await Item.findOne({
        where: {
          id: idItem[0]
        }
      })
      if (!item) {
        await response.destroy()
        return res.send({
          type: "error",
          message: `nao exixte um produto com esse id ${idItem}`
        })
      }
      let valor = (await OrderItems.create({
        idItem: idItem[0],
        quantity: idItem[4],
        valueUnit: idItem[3],
        valueTotal: idItem[3] * idItem[4],
        idOrder: response.id
      })).valueTotal

      valorTotal += Number(valor);
    }
    response.valueTotal = valorTotal;
    response.save();

    let itens = await response.getItems()
    response = response.toJSON()
    response.items = itens;

    return res.send({
      type: "success",
      message: `Compra efetuada com sucesso, Acesse pedidos para conferir`,
      data: response
    })

  } catch (error) {
    return res.send({
      type: "error",
      message: error.message
    })
  }
}

const destroy = async (req, res) => {
  try {
    let { id } = req.body;
    id = id ? id.toString().replace(/\D/g, '') : null;

    if (!id) {
      return res.send({
        type: "error",
        message: `Não foi encontrado nenhum id ${id}`
      })
    }

    let response = await Order.findOne({
      where: { id }
    })

    if (!response) {
      return res.send({
        type: "error",
        message: `Não existe nenhum registro com o id ${id}`
      })
    }

    await Order.destroy({
      where: { id }
    })

    return res.send({
      type: "sucess",
      message: `O registro id ${id} foi permanentemente deletado`
    })

  } catch (error) {
    return res.send({
      type: "error",
      message: error.message
    })
  }
}
export default {
  get,
  persist,
  destroy
};