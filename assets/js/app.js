var cl=console.log;
const passangersdata=document.getElementById("passangersdata")
const form=document.getElementById("form")
const PassangersName=document.getElementById("PassangersName")
const JourneyType=document.getElementById("JourneyType")
const NumberofPassanger=document.getElementById("NumberofPassanger")
const from=document.getElementById("from")
const To=document.getElementById("To")
const Age=document.getElementById("Age")
const SubmitBtn=document.getElementById("SubmitBtn")
const UpdateBtn=document.getElementById("UpdateBtn")



const Base_url="https://xhrcrud-default-rtdb.firebaseio.com"
const Ticket_url=`${Base_url}/ticket.json`

// localstorage
state={
    TicketArr:[],
    Edit_Id:null,
}

// Snakbar
function Snakbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:2500,
    
    })
}

// spinner
function Handlespinner() {
    spinner.classList.toggle("d-none")
    
}


// Templating
function SowData(arr){
    let result=``;
    arr.forEach((ele,i) => {
        result+=`  <tr id="${ele.id}">
                    
                    <td>${i+1}</td>
                    <td>${ele.name}</td>
                    <td>${ele.Journey}</td>
                    <td>${ele.passangers}</td>
                    <td>${ele.from}</td>
                    <td>${ele.to}</td>
                    <td>${ele.age}</td>
                    <td>${ele.paymentOption}</td>



                    <td><i onclick="OnEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                    <td><i onclick="Onremove(this)"  class="fa-solid fa-trash-can fa-2x text-danger"></i></td>
                    
                </tr>
               
        `
        
    });
    passangersdata.innerHTML=result;
}

// Read

function OnShowAll(){
    Handlespinner();
    fetch(Ticket_url,{
        method:"GET",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        }

    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR:${res.status}`)
        }
        return res.json();

    })
    .then(data=>{
        state.TicketArr=[];
        for(const key in data){
            data[key].id=key
            state.TicketArr.unshift(data[key]);
        }
            SowData(state.TicketArr)

    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        Handlespinner()
    })
}

OnShowAll();









// create
function OnCreate(eve){
    Handlespinner();
    eve.preventDefault();
    const payment=document.querySelector(`input[name="payment"]:checked`)
    
    let newobj={
        name:PassangersName.value,
        Journey:JourneyType.value,
        passangers:NumberofPassanger.value,
        from:from.value,
        to:To.value,
        age:Age.value,
        paymentOption: payment ? payment.value : "none"

    }
    fetch(Ticket_url,{
        method:"POST",
        body:JSON.stringify(newobj),
        headers:{
             
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        }
        
    })
        .then(res=>{
            if(!res.ok){
                throw new Error(`HTTP EROR ${res.status}`);
                
            }
            return res.json();

        })
        .then(data=>{
            let tr= document.createElement("tr");
            tr.id=data.name;
            tr.innerHTML=`<td>${1}</td>
                    <td>${newobj.name}</td>
                    <td>${newobj.Journey}</td>
                    <td>${newobj.passangers}</td>
                    <td>${newobj.from}</td>
                    <td>${newobj.to}</td>
                    <td>${newobj.age}</td>
                    <td>${newobj.paymentOption}</td>



                    <td><i onclick="OnEdit(this)"  class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                    <td><i onclick="Onremove(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i></td>
            `
            passangersdata.append(tr)
             let td=[...document.querySelectorAll("#passangersdata tr td:first-child")];
                             td.forEach((td,i) => {
                                td.innerHTML=i+1
                            });

            Snakbar("Data Created Sucsessfully","success")
            form.reset();
        })
        .catch(err=>{
            cl(err)

        })
        .finally(()=>{
            Handlespinner();

        })
    
    
    


}




    
// Edit
function OnEdit(eve) {

    let Edit_Id = eve.closest("tr").id;
    state.Edit_Id = Edit_Id;
    let EdObj = state.TicketArr.find(t => t.id == Edit_Id);

    PassangersName.value = EdObj.name;
    JourneyType.value = EdObj.Journey;
    NumberofPassanger.value = EdObj.passangers;
    from.value = EdObj.from;
    To.value = EdObj.to;
    Age.value = EdObj.age;

    let payment = document.querySelector(
        `input[name="payment"][value="${EdObj.paymentOption}"]`
    );
    if (payment) {
        payment.checked = true;
    }

    SubmitBtn.classList.add("d-none");
    UpdateBtn.classList.remove("d-none")
}


//update
function OnUpdateTickets(eve){
    Handlespinner();
        const payment=document.querySelector(`input[name="payment"]:checked`)

    let update_Id=state.Edit_Id;
    let Upoj={
        name:PassangersName.value,
        Journey:JourneyType.value,
        passangers:NumberofPassanger.value,
        from:from.value,
        to:To.value,
        age:Age.value,
        paymentOption: payment ? payment.value : "none"


    }
    let Update_url=`${Base_url}/ticket/${update_Id}.json`
    fetch(Update_url,{
        method:"PATCH",
        body:JSON.stringify(Upoj)
    })

.then(res=>{
    if(!res.ok){
                throw new Error(`HTTP EROR ${res.status}`);
                
            }
            return res.json();


})
.then(data=>{
    let Getindex=state.TicketArr.findIndex(b=>b.id===update_Id);
    state.TicketArr[Getindex]=data;
    let td= document.getElementById(update_Id).children;
    td[1].innerHTML=data.name,
    td[2].innerHTML = data.Journey;
        td[3].innerHTML = data.passangers;
        td[4].innerHTML = data.from;
        td[5].innerHTML = data.to;
        td[6].innerHTML = data.age;
        td[7].innerHTML = data.paymentOption;
        SubmitBtn.classList.remove("d-none");
    UpdateBtn.classList.add("d-none")
    form.reset();
state.Edit_Id = null;

})
.catch(err=>{
    cl(err)

})
.finally(()=>{
    Handlespinner();

})
}



// delelete
function Onremove(eve){

    let Remove_id=eve.closest("tr").id;
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
            Handlespinner();

    let Remove_url=`${Base_url}/ticket/${Remove_id}.json`
    fetch(Remove_url,{
        method:"DELETE",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error (`HTTP ERROR:${res.status}`)
        }
        return res.json();
    })
    .then(data=>{
        let Getindex= state.TicketArr.findIndex(d=>d.id===Remove_id);
        state.TicketArr.splice(Getindex,1);
        eve.closest("tr").remove();
        let td=[...document.querySelectorAll("#passangersdata tr td:first-child")];
                             td.forEach((td,i) => {
                                td.innerHTML=i+1
                            });

        Snakbar("Your Item remove sucsessfully!!","success")


    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        Handlespinner();
    })

  }
})
}


form.addEventListener("submit",OnCreate)
UpdateBtn.addEventListener("click",OnUpdateTickets)