## О ПРОЕКТЕ

## Бейдж CI: 

[![CI](https://github.com/viktrofimova/viktoria_trofimova-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/viktrofimova/viktoria_trofimova-tests/actions/workflows/ci.yml)


## Проект содержит автотесты на трёх уровнях:

* Unit — проверка отдельных функций без браузера и сети
* API — проверка HTTP-сценариев через локальный mock-сервер
* E2E — проверка пользовательских сценариев в браузере на сервисе PomidorQA


## Стек:

* TypeScript
* Playwright


## Требования:

Функциональные требования PomidorQA описаны в [`requirements.md`](requirements.md)
Покрытие требований связано с конкретными автотестами и уровнями тестирования: Unit, API и E2E


## Покрытие требований

Текущий набор содержит **51 автотест** и покрывает **45 из 50 функциональных требований MVP — 90%**

Покрытие распределено между Unit, API и E2E-тестами. Для каждого требования указано, какой автотест его проверяет


## Unit:

Unit-тесты проверяют отдельные функции проекта и дополняют проверки на API и E2E-уровнях

- **Пересечение временных слотов** — [`tests/unit/slots.spec.ts`](tests/unit/slots.spec.ts). Проверяются пересекающиеся, вложенные, совпадающие и расположенные вплотную слоты
- **Отображение времени в часовом поясе** — [`tests/unit/slots.spec.ts`](tests/unit/slots.spec.ts). Проверяется формат времени и его отображение в разных часовых поясах
- **Валидация пароля** — [`tests/unit/slots.spec.ts`](tests/unit/slots.spec.ts). Проверяется минимальная длина пароля: 7 символов — невалидно, 8 — валидно


## API:

API-тесты проверяют серверные бизнес-правила бронирования и регистрации

- **Регистрация нового участника и запрет повторной регистрации с тем же email** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяются успешное создание пользователя и ошибка `email_taken`
- **R10.1 — нельзя забронировать собственный слот** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяется ошибка `cannot_book_own_slot`
- **R10.2 — можно забронировать только свободный слот в будущем** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяется успешное бронирование будущего слота и запрет бронирования слота в прошлом
- **R10.3 — после бронирования создаётся подтверждённая бронь** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяется статус `confirmed` и участники встречи
- **R10.4 — при одновременном бронировании одного слота подтверждается только одна бронь** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяется результат гонки: одна бронь `201`, вторая `409`
- **Обработка несуществующего слота** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяется ошибка `slot_not_found`
- **Повторное бронирование занятого слота** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяется ошибка `slot_already_booked`


## E2E:

1. Регистрация и авторизация:
- **R4.1 — для регистрации обязательны имя, email и пароль** — [`tests/e2e/registration-required.spec.ts`](tests/e2e/registration-required.spec.ts). Проверяется валидация каждого обязательного поля
- **R4.2 — пароль должен содержать не менее 8 символов** — [`tests/unit/slots.spec.ts`](tests/unit/slots.spec.ts). Проверяется граничное значение длины пароля
- **R4.3 — после регистрации создаётся профиль с данными пользователя и часовым поясом Europe/Moscow** — [`tests/e2e/registration.spec.ts`](tests/e2e/registration.spec.ts). Проверяется имя из формы и часовой пояс по умолчанию
- **R4.4 — нельзя зарегистрировать второй аккаунт с существующим email** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяется ошибка при повторной регистрации
- **R4.5 — при неверном email и пароле показывается одинаковая ошибка** — [`tests/e2e/login-error.spec.ts`](tests/e2e/login-error.spec.ts). Сравниваются сообщения об ошибке в обоих случаях
- **R4.6 — после входа сессия сохраняется, после выхода завершается** — [`tests/e2e/login-success.spec.ts`](tests/e2e/login-success.spec.ts). Проверяется сохранение авторизации после перезагрузки и закрытие доступа после выхода

2. Доступ и роли:
- **R3.1 — гость может просматривать каталог** — [`tests/e2e/guest-booking.spec.ts`](tests/e2e/guest-booking.spec.ts). Проверяется поиск участника в каталоге
- **R3.2 — гость может открыть страницу участника и увидеть свободный слот** — [`tests/e2e/guest-booking.spec.ts`](tests/e2e/guest-booking.spec.ts). Проверяется открытие профиля и выбор свободного слота
- **R3.3 — гость не может забронировать звонок без авторизации** — [`tests/e2e/guest-booking.spec.ts`](tests/e2e/guest-booking.spec.ts). Проверяется требование войти в аккаунт и отсутствие успешного бронирования
- **R3.4 — приватные страницы недоступны неавторизованному пользователю** — [`tests/e2e/auth-guard.spec.ts`](tests/e2e/auth-guard.spec.ts). Проверяется перенаправление на страницу авторизации
- **R3.5 — участник может редактировать профиль и навыки** — [`tests/e2e/profile-flow.spec.ts`](tests/e2e/profile-flow.spec.ts), [`tests/e2e/profile-skills.spec.ts`](tests/e2e/profile-skills.spec.ts). Проверяется изменение данных профиля и работа с навыками
- **R3.6 — участник может добавлять и удалять свои свободные слоты** — [`tests/e2e/slot-management.spec.ts`](tests/e2e/slot-management.spec.ts). Проверяется создание и удаление свободного слота
- **R3.7 — участник может бронировать слоты других участников** — [`tests/e2e/booking-flow.spec.ts`](tests/e2e/booking-flow.spec.ts). Проверяется полный сценарий бронирования
- **R3.8 — отменить бронирование может хост и гость** — [`tests/e2e/booking-cancel.spec.ts`](tests/e2e/booking-cancel.spec.ts). Есть отдельные сценарии отмены со стороны обоих участников
- **R3.9 — участник видит свои встречи** — [`tests/e2e/booking-flow.spec.ts`](tests/e2e/booking-flow.spec.ts), [`tests/e2e/booking-cancel.spec.ts`](tests/e2e/booking-cancel.spec.ts). Проверяется отображение встреч у хоста и гостя

3. Профиль:
- **R5.1 — имя обязательно для сохранения профиля** — [`tests/e2e/profile-required.spec.ts`](tests/e2e/profile-required.spec.ts). Проверяется валидация пустого имени
- **R5.2 — Telegram является необязательным полем** — [`tests/e2e/profile-flow.spec.ts`](tests/e2e/profile-flow.spec.ts). Проверяется заполнение, сохранение и очистка Telegram
- **R5.3 — часовой пояс выбирается из списка и сохраняется** — [`tests/e2e/profile-flow.spec.ts`](tests/e2e/profile-flow.spec.ts). Проверяется выбор значения и сохранение после перезагрузки
- **R5.4 — поле «О себе» является необязательным** — [`tests/e2e/profile-flow.spec.ts`](tests/e2e/profile-flow.spec.ts). Проверяется заполнение, сохранение и возможность оставить поле пустым
- **R5.5 — время слотов отображается в часовом поясе владельца** — [`tests/e2e/slot-timezone.spec.ts`](tests/e2e/slot-timezone.spec.ts). Проверяется, что гость в другом часовом поясе видит время хоста и соответствующее обозначение часового пояса
- **R5.6 — профиль участника виден другим пользователям** — [`tests/e2e/public-profile.spec.ts`](tests/e2e/public-profile.spec.ts). Проверяются имя, описание, навыки обоих типов и свободный слот

4. Навыки:
- **R6.1 — навык может иметь тип «могу помочь» или «хочу разобрать»** — [`tests/e2e/profile-skills.spec.ts`](tests/e2e/profile-skills.spec.ts), [`tests/e2e/public-profile.spec.ts`](tests/e2e/public-profile.spec.ts). Проверяется добавление навыков обоих типов и их отображение
- **R6.2 — название навыка задаётся свободным текстом** — [`tests/e2e/profile-flow.spec.ts`](tests/e2e/profile-flow.spec.ts). Проверяется ввод собственного названия навыка
- **R6.3 — один и тот же навык одного типа нельзя добавить повторно** — [`tests/e2e/profile-skills.spec.ts`](tests/e2e/profile-skills.spec.ts). Проверяется, что после повторного добавления остаётся одна запись
- **R6.4 — один и тот же навык может существовать в разных типах** — [`tests/e2e/profile-skills.spec.ts`](tests/e2e/profile-skills.spec.ts). Проверяется наличие одной записи в каждом типе
- **R6.5 — навык можно удалить** — [`tests/e2e/profile-skills.spec.ts`](tests/e2e/profile-skills.spec.ts). Проверяется удаление навыка из профиля
- **R6.6 — пустой навык нельзя добавить** — [`tests/e2e/profile-flow.spec.ts`](tests/e2e/profile-flow.spec.ts). Проверяется отсутствие навыка после попытки добавить пустое значение

5. Слоты:
- **R7.2 — нельзя создать слот в прошлом** — [`tests/e2e/slot-management.spec.ts`](tests/e2e/slot-management.spec.ts). Проверяется клиентская валидация даты и отсутствие созданного слота
- **R7.3 — слот имеет состояние free или booked** — [`tests/e2e/slot-management.spec.ts`](tests/e2e/slot-management.spec.ts). Проверяется состояние слота до и после бронирования
- **R7.4 — свободный слот можно удалить** — [`tests/e2e/slot-management.spec.ts`](tests/e2e/slot-management.spec.ts). Проверяется удаление собственного свободного слота
- **R7.5 — забронированный слот нельзя удалить** — [`tests/e2e/slot-management.spec.ts`](tests/e2e/slot-management.spec.ts). Проверяется отсутствие кнопки удаления у занятого слота
- **R7.1 — длительность слота фиксирована и составляет 25 минут** — через UI это требование полноценно не проверяется

6. Каталог:
- **R8.1 — в каталоге показываются участники со свободными слотами в будущем** — [`tests/e2e/search.spec.ts`](tests/e2e/search.spec.ts). Проверяется наличие хоста в результатах поиска
- **R8.2 — участник не видит себя в собственном каталоге** — [`tests/e2e/search.spec.ts`](tests/e2e/search.spec.ts). Проверяется отсутствие собственного профиля в результатах
- **R8.3 — поиск должен находить участников по навыкам из раздела «могу помочь»** — отдельной зелёной проверки нет: фактическое поведение продукта расходится с требованием, поэтому это известный дефект
- **R8.4 — поиск по неизвестному навыку не возвращает участников** — [`tests/e2e/search.spec.ts`](tests/e2e/search.spec.ts). Проверяется пустой результат поиска

6. Страница участника:
- **R9.1 — на странице участника видны имя, «О себе», навыки обоих типов и свободные слоты** — [`tests/e2e/public-profile.spec.ts`](tests/e2e/public-profile.spec.ts). Проверяется весь набор данных публичного профиля
- **R9.2 — забронированные слоты не должны быть доступны как свободные** — [`tests/e2e/slot-management.spec.ts`](tests/e2e/slot-management.spec.ts), [`tests/e2e/booking-flow.spec.ts`](tests/e2e/booking-flow.spec.ts). Проверяется переход слота в состояние `booked` и невозможность повторного бронирования
- **R9.3 — прошедшие слоты не отображаются на странице участника** — напрямую через UI не проверяется, так как тестовый набор не может корректно подготовить такое состояние через интерфейс

7. Бронирование:
- **R10.1 — свой слот нельзя забронировать** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts). Проверяется серверный запрет
- **R10.2 — можно забронировать только свободный слот в будущем** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts), [`tests/e2e/booking-flow.spec.ts`](tests/e2e/booking-flow.spec.ts). Проверяются успешное бронирование и запрет некорректных слотов
- **R10.3 — после успешного бронирования слот становится `booked`, а встреча — `confirmed`** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts), [`tests/e2e/slot-management.spec.ts`](tests/e2e/slot-management.spec.ts). Проверяются статус бронирования и состояние слота
- **R10.4 — при гонке за один слот подтверждается только одна бронь** — [`tests/api/booking-api.spec.ts`](tests/api/booking-api.spec.ts), [`tests/e2e/booking-flow.spec.ts`](tests/e2e/booking-flow.spec.ts). Проверяется успешное бронирование первого участника и ошибка второго
- **R10.5 — закрытие окна подтверждения не создаёт бронирование** — [`tests/e2e/booking-flow.spec.ts`](tests/e2e/booking-flow.spec.ts). Проверяется отмена окна подтверждения и отсутствие новой встречи

8. Отмена бронирования:
- **R11.1 — отменить встречу может хост и гость** — [`tests/e2e/booking-cancel.spec.ts`](tests/e2e/booking-cancel.spec.ts). Проверяются оба сценария отмены
- **R11.2 — за час до начала отмена запрещена** — [`tests/e2e/booking-cancel.spec.ts`](tests/e2e/booking-cancel.spec.ts). Проверяется отказ в отмене и сохранение встречи в ближайших
- **R11.3 — после отмены слот снова становится свободным** — [`tests/e2e/booking-cancel.spec.ts`](tests/e2e/booking-cancel.spec.ts). Проверяется отменённая встреча и возврат слота в состояние `free`

9. Мои встречи:
- **R12.1 — участник видит встречи, где он хост или гость** — [`tests/e2e/booking-flow.spec.ts`](tests/e2e/booking-flow.spec.ts), [`tests/e2e/booking-cancel.spec.ts`](tests/e2e/booking-cancel.spec.ts). Проверяется отображение встречи у обоих участников
- **R12.2 — встречи разделены на ближайшие и прошедшие/отменённые** — [`tests/e2e/booking-cancel.spec.ts`](tests/e2e/booking-cancel.spec.ts). Проверяется попадание подтверждённой встречи в «Ближайшие», а отменённой — в «Прошедшие и отменённые»
- **R12.3 — отменить можно только ближайшую встречу** — [`tests/e2e/booking-cancel.spec.ts`](tests/e2e/booking-cancel.spec.ts). Проверяется отсутствие возможности отмены отменённой встречи


## Пирамида тестирования:

1. Unit:

Unit-тесты проверяют отдельные функции проекта без браузера и сети:

tests/unit/slots.spec.ts — пересечение временных слотов
tests/unit/slots.spec.ts — отображение времени в разных часовых поясах
tests/unit/slots.spec.ts — валидация длины пароля

2. API:

API-тесты проверяют серверные бизнес-правила бронирования и регистрации через локальный mock-сервер:

tests/api/booking-api.spec.ts — регистрация нового участника
tests/api/booking-api.spec.ts — повторная регистрация с существующим email
tests/api/booking-api.spec.ts — успешное бронирование свободного слота
tests/api/booking-api.spec.ts — запрет бронирования собственного слота
tests/api/booking-api.spec.ts — запрет бронирования слота в прошлом
tests/api/booking-api.spec.ts — обработка несуществующего слота
tests/api/booking-api.spec.ts — повторное бронирование занятого слота
tests/api/booking-api.spec.ts — конкурентная попытка двух пользователей забронировать один слот

3. E2E:

E2E-тесты проверяют пользовательские сценарии непосредственно в интерфейсе:

tests/e2e/registration-required.spec.ts — обязательные поля регистрации
tests/e2e/registration.spec.ts — создание профиля после регистрации
tests/e2e/auth-guard.spec.ts — защита приватных страниц
tests/e2e/login-success.spec.ts — успешный вход, сохранение сессии и выход
tests/e2e/login-error.spec.ts — ошибки авторизации
tests/e2e/profile-required.spec.ts — обязательность имени
tests/e2e/profile-flow.spec.ts — поля профиля и базовые действия с навыками
tests/e2e/profile-skills.spec.ts — типы, уникальность и удаление навыков
tests/e2e/slot-management.spec.ts — создание, удаление и состояния слотов
tests/e2e/slot-timezone.spec.ts — отображение времени в часовом поясе владельца
tests/e2e/search.spec.ts — поиск и правила отображения каталога
tests/e2e/public-profile.spec.ts — публичный профиль
tests/e2e/guest-booking.spec.ts — ограничение бронирования для гостя
tests/e2e/booking-flow.spec.ts — основной путь бронирования и конкурентная гонка
tests/e2e/booking-cancel.spec.ts — отмена встреч и окно отмены


## Ключевые сценарии:

Основной пользовательский путь покрыт сквозным E2E-сценарием:

1) регистрация
2) заполнение профиля
3) добавление навыка
4) создание свободного слота
5) поиск участника в каталоге
6) проверка встречи у гостя и хоста
7) проверка конкурентного бронирования

Отдельно покрыты негативные сценарии: неавторизованное бронирование, неверная авторизация, обязательность полей, повторное добавление навыка, прошлые слоты на уровне API и гонка за один слот


## Структура проекта:

src/                исходники mock/unit-логики
 tests/
   api/              API-тесты
   e2e/              браузерные сценарии
   helpers/          тестовые данные и переиспользуемая подготовка
   pages/            Page Object Model
   unit/             unit-тесты
.github/workflows/  GitHub Actions


## Архитектура

- `tests/e2e` — пользовательские сценарии
- `tests/api` — API-проверки
- `tests/unit` — unit-тесты
- `tests/pages` — Page Object
- `tests/helpers` — тестовые данные и подготовка сценариев
- `scripts` — вспомогательные скрипты и CI-интеграция

Тесты разделяют сценарий, работу со страницами и подготовку тестовых данных


## CI:

GitHub Actions запускает установку зависимостей, ESLint и Playwright-тесты на push и pull_request

GitHub Actions использует результаты Playwright для CI-проверки и отправляет сводку прогона в Telegram. В Telegram доступны ссылки на репозиторий, GitHub Actions и соответствующий коммит


## Тестовые данные и стабильность:

Тестовые пользователи и уникальные значения генерируются во время прогона. После тестов созданные аккаунты удаляются через API, а браузерные контексты закрываются


## Отчётность:

После запуска Playwright формируются:

1) HTML-отчёт с результатами тестов
2) JSON-отчёт с машинно-читаемыми результатами

при падении E2E-тестов сохраняются screenshot, video и trace



