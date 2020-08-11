const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cursonode',
    password: '2013jota',
    port: 5432,
});

router.get('/test', (req, res) =>{
    res.send('Este serviço está funcionando')
})

router.get('/', async (req, res) => {
    let client

    try {
        client = await pool.connect();
        await client.query('select * from tbclientes')
            .then(respostaBanco => {
                res.status(200).json(respostaBanco.rows)
        })
    } catch (err) {
        res.status(500).send();
        
    } finally {
        if (client)
            client.end();
    }
})

router.get('/:id', async (req, res) => {
    let client

    try {
        client = await pool.connect();
        await client.query('select * from tbclientes where id_cliente = ' + req.params.id)
            .then(respostaBanco => {
                if (respostaBanco.rowCount == 0)
                    res.status(404).send()
                else
                    res.status(200).json(respostaBanco.rows[0])
        })
    } catch (err) {
        res.status(500).send();
 
    } finally {
        if (client)
            client.end();
    } 
})

router.post('/', async (req, res) => {
    const cliente = req.body;

    let client;


    //validações
    if (cliente.tipo !== 'F' && cliente.tipo !== 'J')
        res.status(400).send({"erro":"Tipo de cliente inválido"})
    try {
        client = await pool.connect();
        
        await client.query("select nextval('tbclientes_id_cliente_seq')")
            .then(async respostaBanco => {
                const idNovoCliente = respostaBanco.rows[0].nextval;

                await client.query('insert into tbclientes (id_cliente,tipo,nome) values($1,$2,$3)', [idNovoCliente,cliente.tipo, cliente.nome])
                    .then(async () => {
                        
                        await client.query('select * from tbclientes where id_cliente = ' + idNovoCliente)
                            .then(respostaGet => {
                                if (respostaGet.rowCount == 0)
                                    res.status(404).send()
                                else
                                    res.status(201).json(respostaGet.rows[0])
                            })  
                    })
        })

    } catch (err) {
        res.status(500).send();

    } finally {
        if (client)
            client.end();
    }
})

router.put('/:id', async (req, res) => {
    const cliente = req.body;
    const idCliente = req.params.id;

    let client;

    //validações
    if (cliente.tipo !== 'F' && cliente.tipo !== 'J')
        res.status(400).send({ "erro": "Tipo de cliente inválido" })

    try {
        client = await pool.connect();

        await client.query('update tbclientes set tipo = $1, nome = $2 where id_cliente = ' + idCliente,
            [cliente.tipo, cliente.nome])
            .then(async () => {
                await client.query('select * from tbclientes where id_cliente = ' + idCliente)
                    .then(respostaGet => {
                        if (respostaGet.rowCount == 0)
                            res.status(404).send()
                        else
                            res.status(200).json(respostaGet.rows[0])
                    })
            })

    } catch (err) {
        res.status(500).send()
    } finally {
        if (client)
            client.end();
    }
})

router.delete('/:id', async (req, res) => {
    let client;

    try {
        client = await pool.connect();

        await client.query("delete from tbclientes where id_cliente = " + req.params.id)
            .then(() => {
                res.status(200).send()
        })
    } catch (err) {
        res.status(500).send()
    } finally {
        if (client)
            client.end();
    }
})

module.exports = router;
