var list = document.querySelectorAll("a p");
var contextmenu = document.querySelector(" ul.contextmenu");
var contextmenuItem = document.querySelectorAll("li a");

document.addEventListener("contextmenu", (e)=>{
        
    if (e.target.localName !== "p")   
        contextmenu.setAttribute("hidden", "");
    
        
} );


if(contextmenu.hasAttribute("hidden")){
    window.addEventListener("click", ()=> contextmenu.setAttribute("hidden", ""));
}
    

for(var i = 0; i< list.length; i++){ 
    list[i].addEventListener("contextmenu", (e)=> {
        let item = e.target.innerText;


        contextmenu.style.left = (e.pageX) + "px";
        contextmenu.style.top = e.pageY + "px";

        e.preventDefault();
        contextmenu.removeAttribute("hidden", "");

        for(var j = 0; j < 2; j++){ 
            contextmenuItem[j].addEventListener("click", (e)=>{
                let optn = e.target.innerText;

                if( optn == 'Delete')
                    location.href = "/delete/" + item;
                else
                    location.href = "/lists/" + item;
            });
        }
    
    });
}

// for new list items
var hidden = document.querySelector("form").hasAttribute("hidden");

if(!hidden) toggleInputBox();

document.querySelector("button").addEventListener("click",()=>{
    document.querySelector(".input-box").toggleAttribute("hidden");
    toggleInputBox();
});

function toggleInputBox(){
    hidden = document.querySelector("form").hasAttribute("hidden");

    document.querySelector(".info.item button").classList.toggle("rotate");

    if(!hidden) document.querySelector(".info p").textContent = "Create new list";
    else document.querySelector(".info p").textContent = "Your list";

}