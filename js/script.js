//assistant
let timer;
document.addEventListener("DOMContentLoaded", function() {
    timer = setTimeout(showAssistant, 5000);
});

function showAssistant() {
    clearTimeout(timer);
    document.getElementById("assistant").style.display = "block";
}

// External Carousell


function adjustImageSize(value) {
    var images = document.querySelectorAll('.carousel-item img');
    value = parseInt(value);
    images.forEach(function(image) {
        image.style.maxWidth = value + '%'; // Ajusta l'amplada màxima de les imatges
        image.style.height = 'auto'; // Manté l'altura proporcional
    });
}


  // Fetch data from nas20.json


  
  function updateFooter(data) {
    const nasdaqScroll = document.getElementById('nasdaq-scroll');
    nasdaqScroll.innerHTML = '';

    // Loop through each company data
    data.forEach(company => {
      const change = parseFloat(company.change);

      // Set color based on change value
      let textColorClass = '';
      if (change > 0) {
        textColorClass = 'text-success'; // Verde para cambio positivo
      } else if (change < 0) {
        textColorClass = 'text-danger'; // Rojo para cambio negativo
      }

      // Populate row with company information
      const companyInfo = `
        <div class="col">
          <strong class="${textColorClass}">${company.company}</strong> (${company.symbol}) - 
          Max: ${company.max}, Min: ${company.min}, 
          Currency: ${company.currency}, Change: ${company.change}
        </div>
      `;
      nasdaqScroll.innerHTML += companyInfo;
    });
  }

  // Fetch data from nas20.json
  fetch('/json/nas20.json')
    .then(response => response.json())
    .then(data => {
      const totalCompanies = data.length;
      let index = 0;

      // Update footer with first 2 companies
      updateFooter(data.slice(index, index + 2));

      // Update footer every 2 seconds
      setInterval(() => {
        index = (index + 2) % totalCompanies;
        updateFooter(data.slice(index, index + 2));
      }, 2000);
    })
    .catch(error => console.error('Error fetching data:', error));


        // URL  JSON  enterprises
        var jsonUrl = "/json/nas20.json";

        // Function to read  JSON and fill table enterprises
        function fetchAndPopulateEnterprises() {
            fetch(jsonUrl)
                .then(response => response.json())
                .then(data => {
                    populateEnterprises(data);
                })
                .catch(error => console.error('Error fetching JSON:', error));
        }

        // Function to refill table enterprises
        function populateEnterprises(enterprises) {
            var enterpriseList = document.getElementById("enterprise-list");
            var row;
            for (var i = 0; i < enterprises.length; i++) {
                var enterprise = enterprises[i];
                if (i % 2 === 0) {
                    // everi two enterprises, create a new  row
                    row = document.createElement("tr");
                }
                var companyCell = document.createElement("td");
                companyCell.textContent = enterprise.company; // enterprise name without link
                var websiteCell = document.createElement("td");
                var link = document.createElement("a");
                link.href = enterprise.url;
                link.textContent = enterprise.url.replace(/(^\w+:|^)\/\//, ''); // Show l'URL whithout http:// o https://
                link.target = "_blank"; // new link in a new window
                websiteCell.appendChild(link);
                row.appendChild(companyCell);
                row.appendChild(websiteCell);
                if (i % 2 === 1 || i === enterprises.length - 1) {
                    // fill row at the table end when push 2 enterprises or the last one.
                    enterpriseList.appendChild(row);
                }
            }
        }
         // call function JSON and refill enterprises table.
        fetchAndPopulateEnterprises();

        // graphics scripts          
        $(document).ready(function() {
          var jsonData;
          $.getJSON("/json/nas20.json", function(data) {
            jsonData = data;
            drawChart("min");
          });
    
          $("#btnMin").click(function() {
            drawChart("min");
          });
    
          $("#btnMax").click(function() {
            drawChart("max");
          });
    
          $("#btnChange").click(function() {
            drawChart("change");
          });
    
        // Draw graph from json data
        function drawChart(dataType) {
          var chartData = [];
          for (var i = 0; i < jsonData.length; i++) {
            var item = jsonData[i];
            var color;
            if (dataType === "min") {
              color = (item.min === item[dataType]) ? "red" : "green";
            } else if (dataType === "max") {
              color = (item.max === item[dataType]) ? "green" : "red";
            } else if (dataType === "change") {
              color = (parseFloat(item.change) >= 0) ? "green" : "red";
            }
            var value = (dataType === "change") ? parseFloat(item.change) : item[dataType];
            chartData.push({ label: item.symbol, y: value, color: color });
          }
          var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title: {
              text: "Values " + dataType
            },
            axisX: {
              title: "Company Symbol"
            },
            axisY: {
              title: (dataType === "change") ? "Change (%)" : "Value (USD)"
            },
            data: [{
              type: "column",
              dataPoints: chartData
            }]
          });
        
          chart.render();
        }
        })
        
 // URL JSON images gallery
 // document.body.style.overflowY = "hidden"; ///bloqueja scroll vertical

var jsonPath = "/json/nas20.json";

// Function to read JSON and fill image gallery
function fetchAndPopulateGallery(imagesPerRow) {
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            populateGallery(data, imagesPerRow);
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

// Function to refill image gallery
function populateGallery(images, imagesPerRow) {
    var imageGallery = document.getElementById("image-gallery");
    imageGallery.innerHTML = ''; // Clear existing images
    var imageRow = document.createElement("div");
    imageRow.classList.add("row");
    var imagesInCurrentRow = 0;
    images.forEach((image, index) => {
        if (imagesInCurrentRow >= imagesPerRow) {
            imageGallery.appendChild(imageRow);
            imageRow = document.createElement("div");
            imageRow.classList.add("row");
            imagesInCurrentRow = 0;
        }
        var imageElement = document.createElement("div");
        imageElement.classList.add("col-md-" + (12 / imagesPerRow)); // Modifica el nombre de columnes en base a les imatges per fila
        imageElement.classList.add("image-item-" + index);
        var img = document.createElement("img");
        img.src = image.path;
        img.alt = image.company;
        img.classList.add("img-thumbnail"); // Afegit estil per reduir la mida de les imatges
        imageElement.appendChild(img);
        imageRow.appendChild(imageElement);
        imagesInCurrentRow++;
    });
    imageGallery.appendChild(imageRow); // Add the last row
}

$(document).ready(function() {
    var initialImagesPerRow = 4; // Initial number of images per row

    fetchAndPopulateGallery(initialImagesPerRow);

    var scale = 1.5; // initialize scale

    $('#zoom-in').click(function() {
        if (initialImagesPerRow > 4) {
            if (initialImagesPerRow === 12) {
                initialImagesPerRow = 6;
                var newWidth = parseInt($('.img-thumbnail').css('width')) * 1.5;
                $('.img-thumbnail').css('width', newWidth + 'px');
                fetchAndPopulateGallery(initialImagesPerRow);
            } else if (initialImagesPerRow === 6) {
                initialImagesPerRow = 4;
                var newWidth = parseInt($('.img-thumbnail').css('width')) * 1.5;
                $('.img-thumbnail').css('width', newWidth + 'px');
                fetchAndPopulateGallery(initialImagesPerRow);
            }
        }
    });

    $('#zoom-out').click(function() {
        if (initialImagesPerRow < 12) {
            if (initialImagesPerRow === 4) {
                initialImagesPerRow = 6;
                var newWidth = parseInt($('.img-thumbnail').css('width')) / 1.5;
                $('.img-thumbnail').css('width', newWidth + 'px');
                fetchAndPopulateGallery(initialImagesPerRow);
            } else if (initialImagesPerRow === 6) {
                initialImagesPerRow = 12;
                var newWidth = parseInt($('.img-thumbnail').css('width')) / 3;
                $('.img-thumbnail').css('width', newWidth + 'px');
                fetchAndPopulateGallery(initialImagesPerRow);
            }
        }
    });

    $('#temperature-range').on('input', function() {
        var value = $(this).val();
        var color = 'hsl(' + value + ', 100%, 50%)';
        $('#image-gallery').css('filter', 'hue-rotate(' + value + 'deg)');
    });
});

// Afegim el teu JavaScript per carregar les imatges del JSON 

  function fetchAndPopulateCarousel() {
    fetch("/json/nas20.json")
      .then(response => response.json())
      .then(data => {
        populateCarousel(data);
      })
      .catch(error => console.error('Error fetching JSON:', error));
  }

  function populateCarousel(images) {
    var carouselInner = document.querySelector(".carousel-inner");
    carouselInner.innerHTML = ''; // Netegem el contingut actual del carrusel
    images.forEach((image, index) => {
      var carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (index === 0) {
        carouselItem.classList.add("active");
      }
      var img = document.createElement("img");
      img.src = image.path;
      img.alt = "Image " + (index + 1);
      img.classList.add("d-block");
      img.classList.add("w-100");
      carouselItem.appendChild(img);
      carouselInner.appendChild(carouselItem);
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    fetchAndPopulateCarousel();
  });

 //clients function
  
 document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  // Retrieve last comments from JSON
  fetch('/json/clients.json')
    .then(response => response.json())
    .then(data => {
      const matchingClients = data.filter(client => client.name === name && client.mail === email); // Filtra los clientes que coinciden con el nombre y correo electrónico proporcionados en el formulario
      if (matchingClients.length > 0) {
        const lastClient = matchingClients[matchingClients.length - 1]; // Toma el último cliente que coincide
        const lastComment = lastClient.message; // Toma el último comentario del cliente
        const interest = lastClient.invest; // Obtiene el interés del cliente
        const interestText = getInterestText(interest);
        const combinedText = `Last Comment:\n${lastComment}\n\nInterest:\n${interestText}`;
        document.getElementById('lastComments').value = combinedText;
      } else {
        document.getElementById('lastComments').value = 'No comments found for the provided name and email.';
      }
    })
    .catch(error => console.error('Error retrieving last comments:', error)); // Print any errors to the console
});

function resetForm() {
  document.getElementById('contactForm').reset(); // Reset the form
  document.getElementById('lastComments').value = ''; // Clear the last comments textarea
}

function getInterestText(interest) {
  switch (interest) {
    case 1:
      return '(1,000-10,000$) - Initial investment.';
    case 2:
      return '(10,000-100,000$) -  Mid-range investments.';
    case 3:
      return '1 million or more - large-scale investments.';
    default:
      return '';
  }
}