
loadData();
function loadData (){
    // ========================================================================================================================================================================================
                let  url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR45xjRksAnj4s3bWcLyARSjUWp7hY7rYcATEPty0MHEPdMT6-2WH2In9bjldlgTHSkR2SQn5Jl8tCm/pub?gid=1203789969&single=true&output=csv&range=i2";     
                  fetch(url) 
                  .then(response => response.text())
                  .then(text => {
                   console.log(text)
                   window.alert(text)
                   speed.style.setProperty('--t_1data', text ); 
                 //  text= text.replace("%","");                           // remove % from number in 'text' var
                   //text = text * 10000; 
                   //text = text/100;
            //       document.getElementById("t_1_id").innerHTML='Royal Challengers ' + "<br />" + text + ' Km.'; //display on html page
                                } 
                      //pass url value to variable
                    ); 
                    
                    }