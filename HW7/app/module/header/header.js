(
    function(){
        var moduleName='header';
        
        function render(el){
            console.log('header render called');
        }
        
        exports(moduleName,render);    
    }
)();
