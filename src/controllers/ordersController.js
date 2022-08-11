import { sequelize } from "../config";
import Order from "../models/Order";
import OrderItems from "../models/OrderItems";
import Item from "../models/Item";
import Address from "../models/Address"
import jwt from "jsonwebtoken";



const get = async (req, res) => {
  try {
    let {id} = req.params;
    id = id ? id.toString().replace(/\D/g, '') : null;

    if(!id) {
       let response = await Order.findAll({
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

    let response = await Order.findOne({
      where: { id }
    })

    if(!response){
      return res.send({
        type: 'error',
        message: `Não foi encontrado nenhum registro com o id ${id}`
      })
    };
    let items = await response.getItems()
    response = response.toJSON()
    response.items = items;

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

    let {city, district, address, complement, number, description} = addres
    let response = await Order.create({
      idUserCustumer: idUser,
      city,
      district,
      address,
      complement,
      number,
      IdPaymentMethod: payment.id,
      description: description,
      Description: description
    })

    let valorTotal = 0
    for(let idItem of items.id ) {
      let item = Item.findOne({
        where: {
          id: idItem
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
        idItem,
        quantity,
        valueUnit,
        valueTotal: valueUnit * quantity,
        idOrder: response.id
      })).valueTotal
      valorTotal += valor;
    }
    response.valueTotal = valorTotal;
    response.save();

    let itens = await response.getItems()
    response = response.toJSON()
    response.items = itens;

    return res.send(response)
  
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

    if(!response){
      return res.send({
        type:  "error",
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