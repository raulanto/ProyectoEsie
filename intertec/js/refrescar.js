function refrescar(idDiv,strOpcion,strURL)
{  var pagina     = this;
   var xmlHttpReq = false;

   
   if(window.XMLHttpRequest)     // Mozilla/Safari
   {  pagina.xmlHttpReq = new XMLHttpRequest();
   }else if(window.ActiveXObject)// IE
   { pagina.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
   }
   pagina.xmlHttpReq.open('POST', strURL, true);
   pagina.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   pagina.xmlHttpReq.onreadystatechange = function()
      {  if (pagina.xmlHttpReq.readyState==4) 
         {  var strRespuesta=pagina.xmlHttpReq.responseText;
            document.getElementById(idDiv).innerHTML = strRespuesta;
         }
      }
   pagina.xmlHttpReq.send(strOpcion);
}
function formato(strOpcion,strClave,strValor,strValor2)
{  
return "opc="+strOpcion+";"+strClave+"="+escape(strValor)+";psie="+strValor2+";dummy=0";
}