const express = require('express');
const router = express.Router();

router.get('/teste', (req, res) =>{
    res.send('Este serviço está funcionando')
})

module.exports = router;
