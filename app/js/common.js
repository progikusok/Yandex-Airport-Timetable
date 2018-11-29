/**
* Используование JQuery для динамики страницы:
* закрытие дополнительной информации,
* индикатор прокрутки страницы,
* изменения сотояния у меню для стилей.
*/
$(function() {

	$('.close').click(function() {
		$('.info-wrapper').removeClass('open');
	});

	$('.info-icon svg').click(function() {
		$('.info-wrapper').addClass('open');
	});

	$(window).scroll(function(){
		var wintop = $(window).scrollTop(), 
				docheight = $(document).height(), 
				winheight = $(window).height();

		var scrolled = (wintop/(docheight-winheight))*100;
	
			$('.scroll-indicator').css('width', (scrolled + '%'));
	});

	$('.main-menu li').click(function() {
		$('.main-menu li').removeClass('active');
		$(this).addClass('active');
	});

});

/**
* Используование Vue.js для рективности веб-интерфейса:
* секция, в которой меняются данные имеет id #vue-data;
* имееются основные данные отображения: информация о рейсах,
* состояние загрузки, состояние активности меню, данные input;
* данные берутся по api c https://api.flightstats.com/ ;
* имеются фильтры для правильного отображения данных по api;
* имеются методы для поиска, фильтрации данных согласно меню и получения данных по api.
*/
var app = new Vue({

	/* элемент для vue */
	el: '#vue-data',

	/* данные */
	data() {
		return {
			info: [], // информация для представления на странице
			infoDeparture: null, // информация по рейсам вылета
			infoArrival: null, // информация по рейсам вылета
			loading: true, 
			errored: false,
			action: 'departure', // состояние меню, по умолчанию - вылет
			input: '', // данные input для поиска
			hourInput: '', // часы
			dateInput: '' // дата
		};
	},

	/* фильтры */
	filters: {

		/**
		* Возращает время вылета/прилета из строки даты
		*
		* @param {String} date
		* @returns {String}
		*/
		dateFormat(date) {
			var dateArr = date.match(/\d{1,4}/g, date);
			var airDate = new Date(...dateArr);
			var h = airDate.getHours();
			var m = airDate.getMinutes();
			if (isNaN(h) ||  isNaN(m)) {
				return ''
			}
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return h + ':' + m;
		},


		/**
		* Возращает вназвание города на русском
		* Ищет в файле cases.json
		*
		* @param {String} city
		* @returns {String}
		*/
		cityFormat(city) {
			var idCity = JSON.parse(JSON.stringify(cities));
			if (typeof idCity[city] !== "undefined") {
				return idCity[city].name;
			} else {
				return city;
			}
		}

	},

	/* методы */
	methods: {

		/**
		* Изменение данных в зависимости от активности меню
		*
		* @param {String} action
		*/
		flyAction: function(action) {
		 if (action === 'departure') {
				this.info = this.infoDeparture;
				this.action = 'departure';
			} else if (action === 'arrival') {
				this.info = this.infoArrival; 
				this.action = 'arrival';
			}
		},

		/**
		* Получение данных по  api
		* Используем axios для запросов и управлением ответов
		*
		*/
		getData: function() {

			// устанавливаем лоадер, пока работаем с данными
			this.loading = true;

			// текущая дата
			var today = new Date(),
					todayDay = today.getDate(),
					todayMonth = today.getMonth() + 1,
					todayYear = today.getFullYear(),
					todayCurrentHour = today.getHours();

			// проверям введенные данные с input, разбиваем на поля
			if (this.dateInput === '') {
				this.dateInput = todayYear+'-'+todayMonth+'-'+todayDay;
			} else {
				// дата из input
				var dateArr = this.dateInput.match(/\d{1,4}/g, this.dateInput);
				var tmpDate = new Date(...dateArr);
				todayDay = tmpDate.getDate();
				todayMonth = tmpDate.getMonth() + 1;
				todayYear = tmpDate.getFullYear();
			}

			// час из input
			if (this.hourInput === '' || this.hourInput < 0 || this.hourInput > 23) {
				this.hourInput = todayCurrentHour;
			} else {
				todayCurrentHour = this.hourInput;
			}

			// составляем строки запросов
			var scheduledURL = 'https://cors-anywhere.herokuapp.com/https://api.flightstats.com/flex/schedules/rest/v1/json/from/SVO/departing/'+todayYear+'/'+todayMonth+'/'+todayDay+'/'+todayCurrentHour+'?appId=23c58200&appKey=a9c71a66671694d9a3d5e2562bab8df5';
			var arrivalURL = 'https://cors-anywhere.herokuapp.com/https://api.flightstats.com/flex/schedules/rest/v1/json/to/SVO/arriving/'+todayYear+'/'+todayMonth+'/'+todayDay+'/'+todayCurrentHour+'?appId=23c58200&appKey=a9c71a66671694d9a3d5e2562bab8df5';

			// производим выгрузку данных
			axios
				.get(scheduledURL)
				.then(response => {this.infoDeparture = response.data.scheduledFlights; this.info = this.infoDeparture;})
				.catch(error => {
					console.log(error);
					this.errored = true;
				})
				.finally(() => (this.loading = false));
			axios
				.get(arrivalURL)
				.then(response => {this.infoArrival = response.data.scheduledFlights;})
				.catch(error => {
					console.log(error);
					this.errored = true;
				})
				.finally(() => (this.loading = false));
			}
	},

	/* вычисляемые свойства */
	computed: {

		// фильтруем данные относитльно input поиска
		filteredList() {
			return this.info.filter(air => {
				if (this.input === '') {
					return air;
				} else {
					var inSearchString = air.departureAirportFsCode + ' ' + air.flightNumber;
					// ищем подстроку
					var isExist = inSearchString.indexOf(this.input.toUpperCase());
					if (~isExist) {
						return air;
					}
				}
			})
		}
	},
	
	/* состояние жизненного цикла */
	mounted() {
		
		// загружаем данные впервые
		this.getData();

	}
})
