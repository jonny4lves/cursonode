const Pool = require('pg').Pool;

const main = async () => {

    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'cursonode',
        user: 'postgres',
        password: '2013jota'
    });

    let client = await pool.connect(); 

    await client.query("insert into tbclientes (tipo,nome) VALUES ('F','teste')");

    client.end();

    pool.end();

}

main();