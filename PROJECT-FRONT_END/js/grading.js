function myFunction() {
  var x, text,a,b,c;

  // Get the value of the input field with id="numb"
  x = document.getElementById("quantity").value;

  // If x is Not a Number or less than one or greater than 100
  if(x == null || x == "") {
    alert( "PLEASE FILL OUT THE EMPTY FIELDS");
  } 
  if (isNaN(x) || x < 0 || x > 100) {
    alert("PLEASE FILL OUT THE FIELDS WITH VALID VALUES");

  }
   else {
    text = "Input OK";
  }
  document.getElementById("demo").innerHTML = text;
  
        
        a = document.getElementById("quantity1").value;

        // If x is Not a Number or less than one or greater than 100
        if(a == null || a == "") {
          alert( "PLEASE FILL OUT THE FIELDS WITH VALID VALUES");
        } 
        if (isNaN(a) || a < 0 || a > 10) {
          alert("PLEASE FILL OUT THE FIELDS WITH VALID VALUES");
      
        }
         else {
          text = "Input OK";
        }
        document.getElementById("demo").innerHTML = text;
        b = document.getElementById("quantity2").value;

        // If x is Not a Number or less than one or greater than 100
        if(b == null || b == "") {
          alert( "PLEASE FILL OUT THE FIELDS WITH VALID VALUES");
        } 
        if (isNaN(b) || b < 0 ||b > 5) {
          alert("PLEASE FILL OUT THE FIELDS WITH VALID VALUES");
      
        }
         else {
          text = "Input OK";
        }
        document.getElementById("demo").innerHTML = text;
         
        c = document.getElementById("quantity2").value;
         if(c== null || c== "") {
          alert( "PLEASE FILL OUT THE FIELDS WITH VALID VALUES");
        } 
        if (isNaN(c) || c < 0 ||c>50) {
          alert("PLEASE FILL OUT THE FIELDS WITH VALID VALUES");
      
        }
         else {
          text = "Input OK";
        }
        document.getElementById("demo").innerHTML = text;
              }
              $('.form-group').on('input','.prc',function(){
                var totalSum=0;
                $('.form-group.prc').each(function(){
                    var inputVal = $(this).val();
                    if($.isNumeric(inputVal)){
                        totalSum += parseFloat(inputVal);
                    }
                });
                $('$result').text(totalSum);
    
            });