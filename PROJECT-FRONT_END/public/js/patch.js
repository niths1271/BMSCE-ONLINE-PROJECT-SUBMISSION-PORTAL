document.getElementById("change").addEventListener("click", myfn);

function myfn() {
    
  document.getElementById("change").value = "CONFIRM";
  document.getElementById("change").removeEventListener("click", myfn);
  
  var inputs = document.getElementsByClassName("edit").length;
  for(let i = 0; i < inputs; i++){
      document.getElementsByClassName("edit")[i].removeAttribute("readonly");
  }
  
setTimeout(submitting, 2000);

}

function submitting(){
    document.getElementById("change").setAttribute("type", "submit");
}