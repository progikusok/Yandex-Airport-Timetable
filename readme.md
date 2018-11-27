<h1>Табло рейсов</h1>

<p>Табло рейсов — реализация тестового задания от Яндекса в качестве испытания на стажировку. В табло должны быть реализованы следующие функции:</p>

<ul>
  <li>Просмотр только вылетающих рейсов</li>
  <li>Просмотр только прилетающих рейсов</li>
  <li>Просмотр задержанных рейсов</li>
  <li>Поиск по номеру рейса</li>
</ul>

<h2>Установка и запуск</h2>

    npm i
    gulp

<h2>Используемые библиотеки</h2>

<p>В тестовом задании было указано, что "ограничений на использование шаблонизаторов и библиотек нет". Поэтому я решил использовать следующие библиотеки, которые мне показались наиболее удобными</p>

<ul>
  <li><strong>JQuery</strong> – для динамики работы с веб-приложением;</li>
  <li><strong>Vue.js</strong> – для рекативной отрисовки данных;</li>
  <li><strong>Bootstrap 4</strong> – для адаптивной верстки</li>
</ul>

    dir /fonts
    dir /images
    dir /js

<h2>Реализация</h2>

<p>В условии задания было сказано, что использование публичных api будет плюсом. Поэтому я и начал разработку с поиска подходящих.
  Нашел наиболее подходящие здесь – <code>http://aviation-edge.com/</code>. Но пока отлаживал проект, растратил лимит обращений.
  Ценным данный ресурс был из-за того, что там была информация о задержанных рейсах, которые отобразить требуется по заданию. Далее,
  ресурс попросил меня оплатить подписку, а создать другой аккаунт – также запретил.
</p>

<p>Второй подходящий ресурс – <code>https://api.flightstats.com/</code>. Он в итоге и вошел в конечную сборку. Здесь нет информации о задержанных рейсах.
  Но эти данные имеют ряд преимуществ. Например, для него проще фильтрация, которая соотвествет запросу из поиска. Также данные предоставляются по дате и конкретному часу.
</p>

<p>Другими словами, реализации <i>задеражнных рейсов</i> у меня нет как таковой, потому что нет данных с api для отображения. Но по готовой верстке
  Вы можете заметить, что функционал для данной реализации <i>задеражнных рейсов</i> я подготовил. То есть, если добавить данные в api, то реализация будет готова.
</p>

<p><strong>Надо же чем то компенсировать</strong></p>

<p>Да. Я решил добавить функционала. В данном клиентском приложении можно выбрать данные по конкретной дате и по часу. По умолчанию устанавливается текущая дата и время.</p>
