var models = require('../models/models.js');

/* Autoload :id */
exports.load = function(req, res, next, quizId) {
    models.Quiz.find({
        where: {
            id: Number(quizId)
        },
        include: [{
            model: models.Comment
        }]
    }).then(function(quiz) {
        if (quiz)
        {
            req.quiz = quiz;
            next();
        }
        else
        {
            next(new Error('No existe quizId = ' + quizId));
        }
    }).catch(function(error) {
        next(error);
    });
};

/* GET /quizes con buscador */
exports.index = function(req, res, next) {
    var cadena = "";
    if (req.query.search === undefined)
    {
        models.Quiz.findAll().then(function(quizes) {
            res.render('quizes/index', {
                quizes: quizes,
                errors: []
            });
        }).catch(function(error) {
            next(error);
        });
    }
    else
    {
        cadena = '%' + req.query.search + '%';
        cadena = cadena.replace(/\s/g, '%');
        models.Quiz.findAll( {
            where: ['pregunta like ?', cadena],
            order: ['pregunta']
        }).then(function(quizes) {
            res.render('quizes/index', {
                quizes: quizes,
                errors: []
            });
        }).catch(function(error) {
            next(error);
        });
    }
};

/* GET /quizes/:id */
exports.show = function(req, res) {
    res.render('quizes/show', {
        quiz: req.quiz,
        errors: []
    });
};

/* GET /quizes/:id/answer */
exports.answer = function(req, res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta)
    {
        resultado = 'Correcto';
    }
    res.render('quizes/answer', {
        quiz     : req.quiz,
        respuesta: resultado,
        errors: []
    });
};

/* GET /quizes/new */
exports.new = function(req, res) {
    // crea objeto quiz
    var quiz = models.Quiz.build( {
        pregunta : "Pregunta",
        respuesta: "Respuesta",
        tema: "Tema"
    });
    res.render('quizes/new', {
        quiz: quiz,
        errors: []
    });
};

/* POST /quizes/create */
exports.create = function(req, res, next) {
    var quiz = models.Quiz.build(req.body.quiz);
    quiz.validate().then(function(err) {
        if (err)
        {
            res.render('quizes/new', {
                quiz  : quiz,
                errors: err.errors
            });
        }
        else
        {
            // guarda en DB los campos "pregunta" y "respuesta" de quiz
            quiz.save( {
                fields: ["pregunta", "respuesta", "tema"]
            }).then(function() {
                // redirección HTTP a lista de preguntas
                res.redirect('/quizes');
            });
        }
    }).catch(function(error) {
        next(error);
    });
};

/* GET /quizes/:id/edit */
exports.edit = function(req, res) {
    res.render('quizes/edit', {
        quiz  : req.quiz,
        errors: []
    });
};

/* PUT /quizes/:id */
exports.update = function(req, res, next) {
    req.quiz.pregunta  = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    req.quiz.validate().then(function(err) {
        if (err)
        {
            res.render('quizes/edit', {
                quiz  : req.quiz,
                errors: err.errors
            });
        }
        else
        {
            // guarda en DB los campos "pregunta" y "respuesta" de req.quiz
            req.quiz.save( {
                fields: ["pregunta", "respuesta", "tema"]
            }).then( function() {
                // redirección HTTP a lista de preguntas
                res.redirect('/quizes');
            });
        }
    }).catch(function(error) {
        next(error);
    });
};

/* DELETE /quizes/:id */
exports.destroy = function(req, res, next) {
    req.quiz.destroy().then(function() {
        res.redirect('/quizes');
    }).catch(function(error) {
        next(error);
    });
};