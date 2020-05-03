# Project Summary:
## Food Pick-up Ordering

A food ordering experience for a single restaurant. Hungry clients of this fictitious restaurant can visit its website, select one or more dishes and place an order for pick-up. They will receive a notification when their order is ready.

The restaurant and client both need to be notified since this app serves as an intermediary.

When an order is placed the restaurant receives the order via SMS. The restaurant can then specify how long it will take to fulfill it. Once they provide this information, the website updates for the client and also notifies them via SMS.

You can use a modern telecomm API service such as Twilio to implement SMS communication from the website to the client and restaurant.

For inspiration check out how Ritual works, but keep in mind that's implemented as a native app and serves more than one restaurant.

### User Stories
#### User
- As a client, I want to be able to order food.
- I want to see the price listed beside each item.
- I want to be able to quickly order food without logging in.
- I want to see a list of the current items in my cart while browsing the menu.
- When I am ready to checkout, I want to be able to quickly hit a checkout button.
- After clicking to checkout, I want to see a summary of my order.
- I want to be able to order with just my name and phone number and pay at the restaurant.
- I want to be notified by text message as soon as the order is ready for pickup.
##### Stretch
- (Stretch) I want to see warnings in the case I have any dietary restrictions.
- (Stretch) I want to know which items are most popular.
- (Stretch) I want to be able to specify any special requests or modifications (such as removing or swapping an ingredient).
- (Stretch) I want to have the option to pay online.
- (Stretch) When I'm in a hurry, I want to be able to quickly repeat my last order.

#### Owner
- As an owner, I want to be notified of new orders immediatly by text.
- I want to see a list of all recent and outstanding orders placed through the website.
- I want the orders listed chronologically as they came in.
- I want the orders that require confirmation listed above the outstanding orders.
- I want to be able to specify how long it will take to fulfill it.
- I want the customer to be notified by text message when the order is ready for pickup.
##### Stretch
- (Stretch) I want to know how much time has passed since each order came in.
- (Stretch) I want to be able to see and edit the items on the menu.
- (Stretch) I want see which items are the most popular.
- (Stretch) I want to be able to post a discount that has a start time and a time it expires.

### Database ERD
##### menu_items table
- id                   SERIAL PRIMARY KEY
- name                 VARCHAR(255)
- description          VARCHAR(255)
- cost                 REAL
- image_url            VARCHAR(255)
- sold_out             BOOLEAN

##### orders table
- id                   SERIAL PRIMARY KEY
- name                 VARCHAR(255)
- phone                VARCHAR(16)
- email                VARCHAR(255)
- ordered_at           TIMESTAMP
- confirmed_at         TIMESTAMP
- estimated_time       INTEGER
- ready_at             TIMESTAMP
- completed_at         TIMESTAMP
- notes                TEXT

##### order_items table
- id                   SERIAL PRIMARY KEY
- order_id             INTEGER REFERENCES orders(id)
- item_id              INTEGER REFERENCES menu_items(id)
- quantity             INTEGER NOT NULL DEFAULT 1

##### extras table (Stretch)
- id                   SERIAL PRIMARY KEY
- name                 VARCHAR(255)

##### order_extras table (Stretch)
- id                   SERIAL PRIMARY KEY
- order_id             INTEGER REFERENCES orders(id)
- order_item_id        INTEGER REFERENCES order_items(id)
- extra_id             INTEGER REFERENCES extras(id)

##### item_reviews table
- id                   SERIAL PRIMARY KEY
- visitor_id           VARCHAR(255)
- item_id              INTEGER REFERENCES menu_items(id)
- rating               INTEGER

#### Stretch
##### discounts
- id                   SERIAL PRIMARY KEY
- amount               REAL
- start_date           DATE
- end_date             DATE
- is_recurring         BOOLEAN

#### Stretch's Stretch
##### recurring_pattern
- id                   SERIAL PRIMARY KEY
- discount_id          INTEGER REFERENCES discounts(id)
- recurring_type       VARCHAR(8)
  ###### Options:
  - daily
  - weekly
  - monthly
  - yearly
- separation_count     INTEGER
- max_num_occurrences  INTEGER
- day_of_week          INTEGER
- week_of_month        INTEGER
- day_of_month         INTEGER
- month_of_year        INTEGER

### Routes & Endpoints

##### Client Side
ROUTE                 Method            Access              Data
- '/'                 Get               user, resturant     Render a welcome page
- '/menu'             Get               user, resturant     Render all menu items and user checkout items
- '/menu/:id'         Get               user, resturant     Render item
- '/order'            Post              user                Add an item to an order

##### API
ROUTE                 Method            Access              Data
- '/api/menu'         Get               user, resturant     Data of items
                      Post              resturant           Resturant owner can make new item
- '/api/menu/:id      Get               user, resturant     Data of item
                      Put               resturant           Update item
                      Delete            resturant           Take item off menu (soft delete)

##### Admin
ROUTE                 Method            Access              Data
- '/admin/'           GET               restaurant          Render owner's page
- '/admin/menu'       GET               restaurant          Render all menu items and ratings
                      POST              restaurant          Add an item to the menu
                      PUT               restaurant          Update an item
                      DELETE            restaurant          Delete an item (Soft delete)
- '/admin/orders'     GET               restaurant          Render all orders
- '/admin/orders/:id' GET               restaurant          Render order           
                      PUT               restaurant          Update order

### PANCAKES!!! (No idea how we'll find photos for these...)
- The Basic Stack - A short stack of buttermilk pancakes. There's really nothing surprising here.
- Stack Overflowed - A short stack of pancakes overflowing with fresh berries and whipped cream.
- The Express Stack - We infused each layer of these coffee-flavoured pancakes with the same amount of caffeine as three cups of coffee. Then we doused them in a coffee-flavoured syrup. These pancakes are guarranteed to keep you going all day, and all night!
- The Hoisted Stack - You just can't stack pancakes higher than this... We tried.
- Stacked Middleware - The breakfast wrap redefined: eggs, bacon and sausage wrapped inside a pancake.
- The D.O.M. Stack - We combined a danish, an omelette and some muesli cereal into a pancake. Are we crazy? Why yes, yes we are!
- Curried Stack – It's like chicken and waffles! But using butter chicken and pancakes.
- The MEAN Stack - Cheesy cornmeal pancakes made with a mix of muenster, edam, asiago and neufchâtel cheese. Because the only thing better than cheese, is more cheese! Who doesn't love cheese?!
- Stack Closure - Pancakes covered in ice cream, brownies, cookie dough and chocolate syrup. The perfect solution to every problem!
- The Full Stack - This stack of pancakes can do anything/everything. Seriously! We crammed so much stuff into these that there may not be much pancake left... The only thing we didn't add was coffee.
