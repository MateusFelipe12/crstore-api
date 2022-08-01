import Category from "../models/Category";

const get = (req, res) => {
  try {
    let {id} = req.body;

    if(!id){
      let response = Category.findAll()

      if(!response){
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
    let response = Category.findOne({
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
      data: response
    });
  } catch (error) {
    res.send({
      type: 'error',
      message: `${error}`
    });
  }
}



const persist = async (req, res) => {
  try {
    console.log(`nan`);
    let {id, name } = req.body;

    if(!name) {
      return res.send({
        type: 'error',
        message: `É necessario informar todos os campos para adicionar o registro`
      });
    }

    // create 
   if(!id){
    let response = Category.create(id, name)
    res.send({
      type: 'success',
      data: response
    });
   }

  //  update 
  let response = await Category.findOne({
    where: {
      id
    }
  });

  if(!response){
    return res.status(400).send({
      message:`Nao existe nenhum registro com o id ${id}`
    })
  }

  let dados = req.body
  Object.keys(dados).forEach(campo => response[campo] = dados[campo] )

  await response.save();
  return res.status(201).send({
    message: `Registro atualizado com sucesso`,
    date: response
  })
  

  } catch (error) {
    res.send({
      type: 'error',
      message: `${error}`
    });
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