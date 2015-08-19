var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Pagina del autor
router.get('/author', function(req, res) {
  res.render('author', { title: 'Author', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);

/* Definición de rutas de sesiones */
// obtener el formulario a rellenar para hacer login
router.get('/login',  sessionController.new);
// enviar formulario para crear la sesión
router.post('/login', sessionController.create);
// destruir la sesión actual
router.get('/logout', sessionController.destroy);

/* Definición de rutas de /quizes */
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);

// Definición de rutas de los comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);

module.exports = router;
