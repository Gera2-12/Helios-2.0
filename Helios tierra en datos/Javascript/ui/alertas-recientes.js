let all=false;                                         
function alerts(){                                   
 $('al').innerHTML=AL.slice(0,all?6:4)                
  .map(a=>'<li><i style="background:'+a[0]+'"></i><span>'+a[1]+'</span><em>'+a[2]+'</em></li>').join(''); 
}
$('all').onclick=()=>{                                
 all=!all;                                              
 $('all').textContent=all?'Ver menos':'Ver todas';    
 alerts();                                  
};