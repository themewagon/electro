(function($) {
	"use strict"

	// Mobile Nav toggle
	$('.menu-toggle > a').on('click', function (e) {
		e.preventDefault();
		$('#responsive-nav').toggleClass('active');
	})

	// Fix cart dropdown from closing
	$('.cart-dropdown').on('click', function (e) {
		e.stopPropagation();
	});

	/////////////////////////////////////////

	// Products Slick
	$('.products-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			autoplay: true,
			infinite: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
			responsive: [{
	        breakpoint: 991,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 1,
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1,
	        }
	      },
	    ]
		});
	});

	// Products Widget Slick
	$('.products-widget-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			infinite: true,
			autoplay: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
		});
	});

	/////////////////////////////////////////

	// Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	// Product img zoom
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
		$('#product-main-img .product-preview').zoom();
	}

	/////////////////////////////////////////

	// Input number
	$('.input-number').each(function() {
		var $this = $(this),
		$input = $this.find('input[type="number"]'),
		up = $this.find('.qty-up'),
		down = $this.find('.qty-down');

		down.on('click', function () {
			var value = parseInt($input.val()) - 1;
			value = value < 1 ? 1 : value;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})

		up.on('click', function () {
			var value = parseInt($input.val()) + 1;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})
	});

	var priceInputMax = document.getElementById('price-max'),
			priceInputMin = document.getElementById('price-min');

	priceInputMax.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	priceInputMin.addEventListener('change', function(){
		updatePriceSlider($(this).parent() , this.value)
	});

	function updatePriceSlider(elem , value) {
		if ( elem.hasClass('price-min') ) {
			console.log('min')
			priceSlider.noUiSlider.set([value, null]);
		} else if ( elem.hasClass('price-max')) {
			console.log('max')
			priceSlider.noUiSlider.set([null, value]);
		}
	}

	// Price Slider
	var priceSlider = document.getElementById('price-slider');
	if (priceSlider) {
		noUiSlider.create(priceSlider, {
			start: [1, 999],
			connect: true,
			step: 1,
			range: {
				'min': 1,
				'max': 999
			}
		});

		priceSlider.noUiSlider.on('update', function( values, handle ) {
			var value = values[handle];
			handle ? priceInputMax.value = value : priceInputMin.value = value
		});
	}

})(jQuery);

document.addEventListener('DOMContentLoaded', function() {
    const wishlist = [];

    function addToWishlist(product) {
        wishlist.push(product);
        updateWishlistView();
    }

    function updateWishlistView() {
        const wishlistContainer = document.getElementById('wishlist-container');
        wishlistContainer.innerHTML = '';
        wishlist.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-widget';
            productElement.innerHTML = `
                <div class="product-img">
                    <img src="${product.img}" alt="">
                </div>
                <div class="product-body">
                    <p class="product-category">${product.category}</p>
                    <h3 class="product-name"><a href="#">${product.name}</a></h3>
                    <h4 class="product-price">${product.price} <del class="product-old-price">${product.oldPrice}</del></h4>
                </div>
            `;
            wishlistContainer.appendChild(productElement);
        });
    }

    document.querySelectorAll('.add-to-wishlist').forEach((button, index) => {
        button.addEventListener('click', function() {
            const product = {
                img: this.closest('.product').querySelector('.product-img img').src,
                category: this.closest('.product').querySelector('.product-category').textContent,
                name: this.closest('.product').querySelector('.product-name a').textContent,
                price: this.closest('.product').querySelector('.product-price').textContent.split(' ')[0],
                oldPrice: this.closest('.product').querySelector('.product-old-price').textContent
            };
            addToWishlist(product);
            document.getElementById('wishlist-modal').style.display = 'block';
        });
    });

    document.querySelector('.modal .close').addEventListener('click', function() {
        document.getElementById('wishlist-modal').style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == document.getElementById('wishlist-modal')) {
            document.getElementById('wishlist-modal').style.display = 'none';
        }
    });
	let cart = [];

function addToCart(productName, productPrice, productImg) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, img: productImg, quantity: 1 });
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartList = document.querySelector('.cart-list');
    const cartSummary = document.querySelector('.cart-summary');
    cartList.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        itemCount += item.quantity;
        cartList.innerHTML += `
            <div class="product-widget">
                <div class="product-img">
                    <img src="${item.img}" alt="">
                </div>
                <div class="product-body">
                    <h3 class="product-name"><a href="#">${item.name}</a></h3>
                    <h4 class="product-price"><span class="qty">${item.quantity}x</span>₹${item.price}</h4>
                </div>
                <button class="delete" onclick="removeFromCart('${item.name}')"><i class="fa fa-close"></i></button>
            </div>
        `;
    });

    cartSummary.innerHTML = `
        <small>${itemCount} Item(s) selected</small>
        <h5>SUBTOTAL: ₹${total}</h5>
    `;
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.closest('.product');
        const productName = product.querySelector('.product-name a').innerText;
        const productPrice = parseInt(product.querySelector('.product-price').innerText.replace('₹', ''));
        const productImg = product.querySelector('.product-img img').src;
        addToCart(productName, productPrice, productImg);
    });
});
// Example function to add items to the cart
function addToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(product);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Example usage
addToCart({ name: "Product Name Goes Here", quantity: 1, price: 980.00 });
});
