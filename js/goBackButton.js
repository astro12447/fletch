//функция goBackButton предназначена для добавления 
//прослушивателя событий к кнопке с идентификатором backButton. Когда 
//эта кнопка нажата, пользователь возвращается в историю браузера с 
// помощью window.history.back().
function goBackButton(){
    const BackButton = document.getElementById('backButton');
    BackButton.addEventListener('click', function(){
        window.history.back();
    });
}
goBackButton()