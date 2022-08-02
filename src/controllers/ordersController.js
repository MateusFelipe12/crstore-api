import { sequelize } from "../config/config";
import Order from "../models/Order";
import OrderItems from "../models/OrderItems";
import Item from "../models/Item";

const get = async (req, res) => {
  try {
    let { id } = req.params;
    id = id ? id.toString().replace(/\D/g, '') : null;

    if(!id){
      const responses = await Order.findAll();
      let response = [];
      for (let order of responses) {
        let items = await order.getItems();
        order = order.toJSON();
        order.items = items; 
        response.push(order);
      }
      return res.status(200).send({
        type: "succes",
        data: response
      });
    }

    if (!id) {
      return res.status(200).send({
        message: 'Informe um id válido para consulta'
      });
    }

    let response = await Order.findOne({
      where: {
        id
      }
    });

    if (!response) {
      return res.status(400).send({
        message: `Não foi encontrado resgistro com o id ${id}`
      });
    }

    response = response.toJSON();
    response.items = await response.getItems({
      attributes: ['id', 'titulo'],
    });

    return res.status(200).send({
      type: "succes",
      data: response
    });

  } catch (error) {
    return res.status(200).send({
      type: "error",
      message: error.message
    })
  }
}

const persistir = async (req, res) => {
  try {
    let { id } = req.params;
    //caso nao tenha id, cria um novo registro
    if (!id) {
      return await create(req.body, res)
    }
    return await update(id, req.body, res)
  } catch (error) {
    return res.status(200).send({
      type: "error",
      message: error.message
    })
  }
}
//////////////////ddddddddddddddddddddddddddddddddrtbhjomndvhqe90ruivpqen debbug
const create = async (dados, res) => {
  let { idUser, idItems } = dados;
  let city, district, address, complement, number //pegar id do token, buscar os endereços, e fazer uma func pra enviar

  let response = await Order.create({
    city, district, address, complement, number, idUser, IdPaymentMethod
  });
  
  for (let index = 0; index < idItems.length; index++) {
    
    let responses = await Item.findOne({
      where: {
        id: idItems[index]
      }
    })
    
    if (!responses) {
      await response.destroy();
      return res.status(200).send({
        message: `Nao é possivel pedir um produto que não existe`
      })
    }

    await OrderItems.create({
      idOrder: response.id,
      idItem: responses[index]
    });
  }
  
  return res.status(201).send(emprestimo)
}

const update = async (id, dados, res) => {
  let emprestimo = await Emprestimo.findOne({
    where: {
      id
    }
  });

  if (!emprestimo) {
    return res.status(400).send({ type: 'error', message: `Não foi encontrada emprestimo com o id ${id}` })
  }

  //update dos campos
  Object.keys(dados).forEach(field => emprestimo[field] = dados[field]);

  await emprestimo.save();
  return res.status(200).send({
    message: `Emprestimo ${id} atualizada com sucesso`,
    data: emprestimo
  });
}

const deletar = async (req, res) => {
  try {
    let { id } = req.body;
    //garante que o id só vai ter NUMEROS;
    id = id ? id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para deletar o emprestimo'
      });
    }

    let emprestimo = await Emprestimo.findOne({
      where: {
        id
      }
    });

    if (!emprestimo) {
      return res.status(400).send({ message: `Não foi encontrada emprestimo com o id ${id}` })
    }

    await emprestimo.destroy();
    return res.status(200).send({
      message: `Emprestimo id ${id} deletada com sucesso`
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

const livroEmprestado = async (req, res) => {
try {
  console.log(req.body);
  let { idLivro } = req.body

  idLivro = idLivro ? idLivro.toString().replace(/\D/g, '') : null;

  let livros = await Livro.findOne({
    where:{
      id: idLivro
    }
  });

  if(!livros){
    return res.status(200).send({
      message: `nao existe um livro com o id ${idLivro}`,
      error: true
    })
  } 
  
  let response = livros.toJSON()

  response.emprestimo = await livros.getorder({
    where: {
      devolucao: null
    }
  })

  response = response.emprestimo[0] ? response.emprestimo[0].dataValues : null;

  if(response) {
      return res.status(200).send({
        message: `O livro id ${idLivro} está prendete no empréstimo ${response.id}.`,
        data: response
      })
  }

  return res.status(200).send({
    message: `O livro id ${idLivro} não esta pendente em nenhum emprestimo`
  })

  } catch (error) { 
    return res.status(500).send({
    message: error.message
    });
  }
}

const orderLivro = async (req, res) => {
  try {
    let { idLivro } = req.body;
    idLivro = idLivro ? idLivro.toString().replace(/\D/g, '') : null;
    
    let livro = await Livro.findOne({
      where: {
        id: idLivro
      }
    })

    let response = livro.toJSON();
    response.emprestimo = await livro.getorder()
    
    response = response.emprestimo
    let order = []

    response.forEach((emprestimo) => { order.push ( emprestimo.dataValues.id ) });
  
    if(order.length === 0){
      return res.status(400).send({
        message: `O livro id ${idLivro} não esta presente em nenhum emprestimo`
      })
    }

    if(order) {
        return res.status(200).send({
          message: `O livro id ${idLivro} está presente nos empréstimos ${order}.`,
          data: response
        })
    }
   
    return res.status(200).send({message: `O livro ${idLivro} esta presente nos order id ${order}`})

  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

export default {
  get,
  persistir,
  deletar,
  livroEmprestado,
  orderLivro
};
