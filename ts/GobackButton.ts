function GobackButton():void{
    //получаем элемент HTML с идентификатором «backButtom» и приведите его к HTMLElement или нулю.
    const backbuttom = document.getElementById('backButtom') as HTMLElement|null
    if (backbuttom){ // Проверяем, существует ли backButton
        //Добовляем прослушиватель событий клика в backButton
        backbuttom.addEventListener('click',function(){
            //При нажатии кнопки вернитесь в историю браузера.
            window.history.back();
        })
    }
}