
// prepare <paragraph>-s
[...document.querySelectorAll("paragraph")].forEach(p => {

    var div = document.createElement("div");

    div.innerHTML = `<div class="border border-gray-300 rounded p-3 bg-gray-300">
        ${p.innerHTML}
    </div>`

    p.parentElement.replaceChild(div.children[0], p)
})

const pushif = (name, lt, params) => {
    const qS = lt.querySelector(name)
    if (qS) {
        params.push(`${name}: ${qS.textContent}`)
    }

}

// allows adding parameters in form of child html* elements. 
// * the tag name is the same as the parameter name. textContent is the value
const prepareParams = (tagName) => {
    [...document.querySelectorAll(tagName)].forEach(lt => {
        const params = [];
        [...lt.childNodes].forEach(cn => {
            if(cn.tagName){
                pushif(cn.tagName.toLowerCase(), lt, params)
            }
        })

        var paramAttributes = lt.getAttribute("params")?.split(',') || []
        paramAttributes = paramAttributes.concat(params)
        lt.setAttribute("params", paramAttributes.join(','))
    });
}




class MainViewModel {
    constructor() {
        var self = this;
        self.orderedItems = ko.observable({})

        self.menuItems = ko.observableArray(Menu)

        self.yourOrder = ko.observableArray([])

        self.updateYourOrder = function(){
            const o = self.orderedItems()
                const l = Object.entries(o)    
                const list = l.map(x => [JSON.parse(x[0]), x[1]]) 
                self.yourOrder(list)
                self.scrollToBottom()
        }

        self.scrollToBottom = () => {
            const porosia = document.getElementById("porosia")
            porosia.scrollTop = porosia.scrollHeight;
        }
        
        self.truncate = (str, n) => (str.length > n) ? str.slice(0, n-1) + '…' : str;

        self.addItem = function(item){
            const itemStr = JSON.stringify(item)
            if(!self.orderedItems()[itemStr]){                
                self.orderedItems()[itemStr] = 1
            }
            else {
                self.orderedItems()[itemStr]++
            }   
            self.updateYourOrder()         
        }

        self.removeItem = function(item){
            const itemStr = JSON.stringify(item[0])
            if(self.orderedItems()[itemStr]){
                if((self.orderedItems()[itemStr] * 1) > 1 ){
                    self.orderedItems()[itemStr]--
                }
                else {
                    delete self.orderedItems()[itemStr]
                }
                self.updateYourOrder()         
            }
        }

        this.total = ko.pureComputed(function() {
            const total = self.yourOrder().map(x => x[0].price * x[1]).reduce(function(a, b){
                return a + b;
              })

            return (Math.round(total*100)/100.0).toFixed(2);
        }, this);

    }
}


var mainViewModel = new MainViewModel()
ko.applyBindings(mainViewModel);