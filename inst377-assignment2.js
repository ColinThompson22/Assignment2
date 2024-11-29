async function loaddogpic() {
    const dogimages= []
    for(let i=0; i<10; i++) {
        const res= await fetch(`https://dog.ceo/api/breeds/image/random`)
        const images= await res.json()
        dogimages.push(images.message)
    }
    return dogimages

}

async function startslider() {
    const urls= await loaddogpic()
    const slider= document.getElementById("slidercontainer")
    urls.forEach( url => {
        const slide= document.createElement("div")
        const image= document.createElement("img")
        image.src= url
        image.alt= "dogpic"
        slide.appendChild(image)
        slider.appendChild(slide)
    })
    simpleslider.getSlider()
}
async function loadquote() {
    const res= await fetch(`https://zenquotes.io/api/quotes/`)
    const quotes= await res.json()
    console.log(quotes)
    const randomquote= Math.floor(Math.random() * quotes.length)
    const quote= quotes[randomquote].q
    const author= quotes[randomquote].a
    document.getElementById("quote").innerHTML= `"${quote}"`
    document.getElementById("author").innerHTML= `-${author}`

}
async function loadstockinfo() {
    const res= await fetch(`https://tradestie.com/api/v1/apps/reddit?date=2022-04-03`)
    const stocks= await res.json()
    const stocktable= document.getElementById("topfivestocktable")
    const topfive= stocks.slice(0, 5)
    topfive.forEach(stock => {
        const tablerow= document.createElement("tr")
        const ticker= document.createElement("td")
        const tickerlink= document.createElement("a")
        const commentcount= document.createElement("td")
        const sentiment= document.createElement("td")
        const sentimentimg= document.createElement("img")
        tickerlink.innerHTML= `${stock.ticker}`
        tickerlink.href= `https://finance.yahoo.com/quote/${stock.ticker}` 
        commentcount.innerHTML= `${stock.no_of_comments}`
        if(stock.sentiment == "Bullish") {
            sentimentimg.src= "bullish.png"
            sentimentimg.alt="bullishimage"
        } else if(stock.sentiment == "Bearish") {
            sentimentimg.src= "bearish.png"
            sentimentimg.alt= "bearishimage"
        }
        ticker.appendChild(tickerlink)
        tablerow.appendChild(ticker)
        tablerow.appendChild(commentcount)
        sentiment.appendChild(sentimentimg)
        tablerow.appendChild(sentiment)
        stocktable.appendChild(tablerow)
    })
}
let chartinstance= null
async function loadchart(event) {
    event.preventDefault()
   const stocklabel= document.getElementById("stocklabel").value
   const timeline= document.getElementById("timeline").value
   const endate= new Date()
   const startdate= new Date(endate)
   if (timeline == "thirty") {
    startdate.setDate(endate.getDate() -30)
   } else if(timeline == "sixty") {
    startdate.setDate(endate.getDate() - 60)
   } else if(timeline == "ninety") {
    startdate.setDate(endate.getDate() - 90)
   }
   const start= startdate.toISOString().split("T")[0]
   const end= endate.toISOString().split("T")[0]
   const res= await fetch(`https://api.polygon.io/v2/aggs/ticker/${stocklabel}/range/1/day/${start}/${end}?adjusted=true&sort=asc&apiKey=6ciNIBPfkikW9tHeoFsZy1pQ2SfxHGr6`)
   const stockdata= await res.json()
   const dates= []
   const closingprices=[]
   stockdata.results.forEach(item => {
    const date= new Date(item.t)
    const formatdate= date.toISOString().split("T")[0]
    dates.push(formatdate)
    closingprices.push(item.c)
   })
const chartdata = {
  labels: dates,
  datasets: [{
    label: `${stocklabel} Closing Prices`,
    data: closingprices,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};
const config = {
    type: 'line',
    data: chartdata,
  };
  const ctx= document.getElementById("mychart")
  if (chartinstance) {
    chartinstance.destroy()
  }
  chartinstance= new Chart(ctx, config)
  ctx.style.display="block"
}
async function loadbreedbutton() {
    const breedinfobox= document.getElementById("breedinfobox")
    const breedbuttons= document.getElementById("breedbuttonbox")
    const res= await fetch(`https://dogapi.dog/api/v2/breeds`)
    const breedinfo= await res.json()
    const breeddata= breedinfo.data
    breeddata.forEach(breed => {
        const breedattribute= breed.attributes
        const button= document.createElement("button")
        button.innerHTML= breedattribute.name
        button.setAttribute("class", "breedsbuttons")
        breedbuttons.appendChild(button)
        button.addEventListener("click", function() {
            const breedname= document.getElementById("breedname")
            breedname.innerHTML= `Breed: ${breedattribute.name}`
            const breeddescription= document.getElementById("breeddesc")
            breeddescription.innerHTML= `Description: ${breedattribute.description}`
            const breedmax= document.getElementById("maxlife")
            breedmax.innerHTML= `Max Life Expectancy: ${breedattribute.life.max}`
            const breedmin= document.getElementById("minlife")
            breedmin.innerHTML= `Min Life Expectancy: ${breedattribute.life.min}`
            breedinfobox.style.display= "block"
        })

    })
}
if (annyang) {
    const commamds= {
        "hello": () => {
            alert("Hello")
        },
        "change the color to *color": (color) => {
            document.body.style.backgroundColor= color
        },
        "Navigate to *page": (page) => {
            if (page == "home") {
                window.location.href= "inst377-assignment2-home.html"
            } else if (page == "stocks") {
                window.location.href= "inst377-assignment2-stocks.html"
            } else if(page == "dogs") {
                window.location.href= "inst377-assignment2-dogs.html"
            }
        },
        "load dog breed *breed": (breed) => {
            const breedinfobox= document.getElementById("breedinfobox")
            const breedbuttonbox= document.getElementById("breedbuttonbox")
            const breedbutton= Array.from(breedbuttonbox.getElementsByTagName("button"))
            .find(button => button.innerHTML == breed)
            if(breedbutton) {
                breedbutton.click()
                breedinfobox.style.display= "block"
            }
        },
        "lookup *ticker": (ticker) => {
            stock= ticker.replaceAll(" ", "").toUpperCase()
            const stocklabel= document.getElementById("stocklabel")
            stocklabel.value= stock
            const event= new Event("submit")
            loadchart(event)
        }
    }
    annyang.addCommands(commamds)
}
function turnonmic() {
    if (annyang) {
        annyang.start()
    }
}
function turnoffmic() {
    if (annyang) {
        annyang.abort()
    }
}
window.onload= function() {
    startslider()
    loadbreedbutton()
    loadquote()
    loadstockinfo()
}