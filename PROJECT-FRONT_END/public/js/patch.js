document.getElementById("change").addEventListener("click", myfn);

function myfn() {
    
  document.getElementById("change").value = "CONFIRM";
  document.getElementById("change").removeEventListener("click", myfn);
  
  var inputs = document.getElementsByClassName("edit").length;
  for(let i = 0; i < inputs; i++){
      document.getElementsByClassName("edit")[i].removeAttribute("readonly");
      // document.getElementsByClassName("edit")[i].setAttribute("required");
      document.getElementsByClassName("edit")[i].setAttribute("min","0");
      document.getElementsByClassName("edit")[i].setAttribute("max","10");
  }
  
setTimeout(submitting, 2000);

}

function submitting(){
    document.getElementById("change").setAttribute("type", "submit");
}
