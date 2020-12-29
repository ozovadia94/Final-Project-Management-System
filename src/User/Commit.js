import React from 'react';

const commit = (props) => (

   
<article className="Users">
    <section id="boxes" class="py-3">
          <div class="row justify-content-md-center "> 
            
            <div class="col-md-3 py-2">
            <div class="card text-center text-black-50 bg-light ">
              <div class="card-body">
            
              <h6><b> {props.id}</b></h6>
           
                 
           <h6><b> {props.name}</b></h6>
            <p>{props.email}</p>
            <p>{props.git}</p>
            <p>{props.jira}</p>
            <button onClick={props.clicked} type="button" class="btn btn-danger btn-sm">מחק</button>         
      </div>
      </div>
      </div>
      </div>
      </section>
      </article>
   
   
);



export default commit;

