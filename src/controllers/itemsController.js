import Category from "../models/Category";
import Item from "../models/Item";

const get = async (req, res) => {
  try {
    let { id } = req.params;
    id = id ? id.toString().replace(/\D/g, '') : null;

    if (!id) {
      let response = await Item.findAll({
        order: [[['id', 'ASC'],]]
      })

      if (!response.length) {
        return res.send({
          type: 'error',
          message: `Não foi encontrado nenhum registro`
        })
      };

      return res.send({
        type: 'success',
        data: response
      });
    }

    let response = await Item.findOne({
      where: { id }
    })

    if (!response) {
      return res.send({
        type: 'error',
        message: `Não foi encontrado nenhum registro com o id ${id}`
      })
    };

    return res.send({
      type: 'success',
      data: response
    });
  } catch (error) {
    return res.send({
      type: 'error',
      message: error.message
    });
  }
}

const persist = async (req, res) => {
  try {
    let { id, name, price, idCategory, img } = req.body;
    id = id ? id.toString().replace(/\D/g, '') : null;

    if (!name || !price || !idCategory) {
      return res.send({
        type: 'error',
        message: `É necessario informar todos os campos para adicionar o registro`
      });
    }

    // create 
    if (!id) {
      let response = await Item.create({ name, price, idCategory, img });
      return res.send({
        type: 'success',
        message: 'Registros recuperados com sucesso',
        data: response
      });
    }

    //  update 
    let response = await Item.findOne({
      where: {
        id
      }
    });

    if (!response) {
      return res.send({
        type: 'error',
        message: `Nao existe nenhum registro com o id ${id}`
      })
    }

    let dados = req.body
    Object.keys(dados).forEach(campo => response[campo] = dados[campo])

    await response.save();
    return res.status(201).send({
      type: 'success',
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
    let { id } = req.body;
    id = id ? id.toString().replace(/\D/g, '') : null;

    if (!id) {
      return res.send({
        type: "error",
        message: `Informe um id valido`
      })
    }

    let response = await Item.findOne({
      where: { id }
    })
    if (!response) {
      return res.send({
        type: "error",
        message: `Não existe nenhum registro com o id ${id}`
      })
    }

    await Item.destroy({
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