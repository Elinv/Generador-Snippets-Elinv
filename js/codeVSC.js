// funciones para copiar al portapapeles
// -------------------------------------
let fallbackCopyTextToClipboard = (text) => {
   var textArea = document.createElement("textarea");
   textArea.value = text;
   document.body.appendChild(textArea);
   textArea.focus();
   textArea.select();
   // para las notificaciones
   let msg;
   try {
      let successful = document.execCommand('copy');
      msg = successful ? config.msg.success : config.msg.unsucess;
      msg = config.msg.copyToClipb + msg;
      msgNotif(config.msg.titulo + "\r\n", msg)
   } catch (err) {
      msg = config.msg.errCopyToClipb + err;
      msgNotif(config.msg.titulo + "\r\n", msg);
   }
   document.body.removeChild(textArea);
}

let copyTextToClipboard = (text) => {
   if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
   }
   let msg;
   navigator.clipboard.writeText(text).then(function () {
      msg = config.msg.copyToClipbExitosa + '\r\n \r\n => ' + text;
      msgNotif(config.msg.titulo + "\r\n", msg);
   }, function (err) {
      msg = config.msg.copyToClipbErr + err;
      msgNotif(config.msg.titulo + "\r\n", msg);
   });
}
// -------------------------------------

// Filtrar datos a ingresar
let obtVSCSnippet = (codigo) => {
   let res = codigo.split("\n");
   // regex para reemplazar "comillas dobles"
   var regex = new RegExp("\"", "g");
   // total de elemento del array
   let tot = res.length;
   let textoFinal = "";
   // bucle del array
   for (let i = 0; i < tot; i++) {
      let provi = res[i].replace(regex, "\\\"");
      provi = provi.trim();
      if (i == tot - 1) {
         textoFinal += "\"" + provi + "\"\n";
      } else {
         textoFinal += "\"" + provi + "\",\n";
      }
   }
   return textoFinal;
};

// encabezado y pie del snippets
let headEndVSC = (arrSnippet) => {
   let inicio = `
 "${arrSnippet.name}": {
 "scope": "${arrSnippet.scope}",
 "prefix": "${arrSnippet.prefix}",
 "body": [\n`;
   let final = `],
 "description": "${arrSnippet.description}"
 }\n`;
   return inicio + arrSnippet.body + final;
};

// info de nuestro snippets
let arrSnippet = {
   name: "Print to console",
   scope: "javascript,typescript",
   prefix: "log",
   description: "Log output to console",
   body: `         
          
    `
};

// acción del botón
let obtVSCSnippetBut = () => {
   // para los informes
   let infoRes = document.getElementById("VSCinfo");
   //  recorrer los inputs
   let elements = document.getElementsByTagName("input")
   let total = elements.length;
   for (var i = 0; i < total; i++) {
      if (elements[i].value == "") {
         // clases de alerta
         infoRes.classList.add('elinv_warning');
         infoRes.classList.remove('elinv_info');
         infoRes.value = elements[i].placeholder + ' is empty';
         return;
      } else {
         switch (elements[i].name) {
            case "VSCname":
               arrSnippet.name = elements[i].value;
               break;
            case "VSCscope":
               arrSnippet.scope = elements[i].value;
               break;
            case "VSCprefix":
               arrSnippet.prefix = elements[i].value;
               break;
            case "VSCdescription":
               arrSnippet.description = elements[i].value;
               break;
            default:
               break;
         }
      }
   }
   let bodyText = document.getElementById("VSCbody").value
   if (bodyText != "") {
      arrSnippet.body = bodyText;
   }
   // ejecutamos salida
   arrSnippet.body = filtroBody = obtVSCSnippet(arrSnippet.body);
   let snippet = headEndVSC(arrSnippet);
   infoRes.value = "Enviado al portapapeles!";
   // clases de alerta
   infoRes.classList.add('elinv_success');
   infoRes.classList.remove('elinv_warning');
   copyTextToClipboard(snippet);
};

// reset form
let resetForm = () => {
   document.getElementById("frmVSC").reset();
   let infoRes = document.getElementById("VSCinfo");   
   infoRes.classList.remove('elinv_success');
   infoRes.classList.remove('elinv_warning');
   infoRes.classList.add('elinv_info');
};

// name to description
let nameToDescripcion = () => {
   let nameToDescrip = document.getElementById("VSCname").value;
   document.getElementById("VSCdescription").value = nameToDescrip;
   nameToDescrip = nameToDescrip.split(" ").join(".");
   document.getElementById("VSCprefix").value = nameToDescrip;
};

// scope funcion
let scopeFunc = () => {
   document.getElementById("VSCscope").value = "javascript,typescript,html,php,python,csharp";
};
// asignar evento al boton
document.getElementById("VSCBut").addEventListener("click", obtVSCSnippetBut);
document.getElementById("VSCReset").addEventListener("click", resetForm);
document.getElementById("VSCname").addEventListener("focusout", nameToDescripcion);
document.getElementById("VSCscope").addEventListener("dblclick", scopeFunc);
