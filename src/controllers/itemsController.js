import Item from "../models/Item";

const get = (req, res) => {
  try {
    let items = Item.findAll()
    res.send({
      type: 'success',
      data: items
    });
  } catch (error) {
    
  }
}

const persist = (req, res) => {
  try {
    let {id, name, price, idCategoria } = req.body;
    if(!id || !name || !price || !idCategoria) {
      return res.send({
        type: 'error',
        message: `Informe id, name, price e idCategoria`
      });
    }
    Item.create(id, name, price, idCategoria)
    res.send({
      type: 'success'
    });
  } catch (error) {
    
  }
}

const destroy = (req, res) => {
  res.send({
    type: 'success',
    message: 'Voce conseguiu no DESTROY!!'
  });
}

export default {
  get,
  persist,
  destroy
}