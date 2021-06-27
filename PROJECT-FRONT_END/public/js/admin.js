function showNotification(from, align){
     $.notify({
         icon: "add_alert",
         message: "TEACHER HAS BEEN ADDED SUCCESSFULLY",
     
     },{
         type: 'success',
         timer: 4000,
         placement: {
             from: from,
             align: align
         }
     });
     }