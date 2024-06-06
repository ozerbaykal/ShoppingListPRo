//*düzenleme seçenekleri  false iken düzenleme modunda
let editFlag = false;

let editElement;  //Düzenleme yapılan öğeyi temsil eder sonra değiştirilcek
let editID = ""; //düzenleme yapılan öğenin benzersiz kimliği

const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");

const list = document.querySelector(".grocery-list");

const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");






//! functions
const displayAlert = (text, action) => {

    alert.textContent = text; //alert claslı etiketin içerisini dışardan gönderilen parametre ile değiştirdik
    alert.classList.add(`alert-${action}`); //p etiketine dinamik class ekledik


    setTimeout(() => {
        alert.textContent = ""; //eklediğimiz p etiketinin içi boş hale getirdik
        alert.classList.remove(`alert-${action}`);//dinamik olarak eklediğimiz class ı kaldırdık.


    }, 2000)


}


//varsayılan değerlere döndürür
const setBacktoDefault = () => {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Submit";
}



const addItem = (e) => {

    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();  //unique id is created  


    if (value !== "" && !editFlag) {
        const element = document.createElement("article");//new article element is created
        let attr = document.createAttribute("data-id"); //*new "data id" is created ---->>>> we created a data feature --
        attr.value = id;

        element.setAttributeNode(attr);//"data id" attribute is set
        element.classList.add("grocery-item");//add class to article tag
        element.innerHTML = `
        <p class="title"> ${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button "class="delete-btn">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>
            
        `;

        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", deleteItem);
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);

        list.appendChild(element); //article tag is added to html

        displayAlert("Edit Sucsessful ", "sucsess")
        
      

        addToLocalStorage(id, value);
        setBacktoDefault();





    } else if (value !== "" && editFlag) {
        editElement.innerText = value;
        displayAlert("Edit Succseful", "sucsess")
        
        editLocalStorage(editID,value);
        
        setBacktoDefault();



    }


};
const deleteItem = (e) => {   //item silme fonksiyonu..

    const element = e.target.parentElement.parentElement.parentElement;//sileceğimiz elemeana ulaştık çocuktan parent a ulaştık
    const id=element.dataset.id;
    list.removeChild(element);

    displayAlert("remove succsesfull", "danger"); //displayAlert fonksiyonunu kullnarak text ve class ekledik bizden ,iki parametre istiyordu.
    removeFromLocalStorage(id);
};

const editItem = (e) => {
    const element = e.target.parentElement.parentElement.parentElement;
    editElement = e.target.parentElement.parentElement.previousElementSibling;//düzenleme yapacağımız etiketi seçtik 
    grocery.value = editElement.innerText; //düzenlediğimiz etiketin içeriğini  inputa aktardık
    editFlag = true;
    editID = element.dataset.id; //düzenlenen öğenin kimliğini gönderdik
    submitBtn.textContent = "Edit" //düzenle butonuna tıklanılığında submit butonu edit olarak değişsin

}

const clearItems = () => {

    const items = document.querySelectorAll(".grocery-item");
    //listede article etiketi var mı onu kontrol ediyoruz
    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);//for each ile diziyi dönerek her bil öğeyi sildik.
        })
    }

    displayAlert("List is Empty", "danger");
    localStorage.removeItem("list");




}



const addToLocalStorage = (id, value) => {
    const grocery = { id, value };
    let items=getLocalStorage();
    items.push(grocery);
    


localStorage.setItem("list", JSON.stringify(items));

};
//get items from Local Storage
function getLocalStorage(){
   return (localStorage.getItem("list")) ? JSON.parse(localStorage.getItem("list")):[];

} ;

//yerel depoda idsine göre silme işlemi
const removeFromLocalStorage=(id)=>{
   let items=getLocalStorage();
   items=items.filter((item) => item.id !==id );
   localStorage.setItem("list",JSON.stringify(items));




}

const editLocalStorage = (id,value) =>{
    let items= getLocalStorage();
    items=items.map((item)=>{
        if(item.id===id){
            item.value=value;

        }
        return item;
    })

    localStorage.setItem("list",JSON.stringify(items));


}

//gönderilen id ve value sahip  bir öğe  oluşturan fonksiyon
const createListItem =(id,value)=>{
    const element = document.createElement("article");//new article element is created
    let attr = document.createAttribute("data-id"); //*new "data id" is created ---->>>> we created a data feature --
    attr.value = id;

    element.setAttributeNode(attr);//"data id" attribute is set
    element.classList.add("grocery-item");//add class to article tag
    element.innerHTML = `
    <p class="title"> ${value}</p>
                <div class="btn-container">
                    <button type="button" class="edit-btn">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button "class="delete-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
        
    `;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element); //article tag is added to html

    displayAlert("Edit Sucsessful ", "sucsess")

};

const setupItems=() => {
    let items=getLocalStorage();

    if(items.length>0){
        items.forEach((item)=> {
            createListItem(item.id,item.value);
        });
    }

    
};


//! Event Lİsteners

form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

window.addEventListener("DOMContentLoaded",setupItems);



