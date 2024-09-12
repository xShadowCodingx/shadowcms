# ShadowCMS
## Open Source CMS

##### Key Features:

- Written in JavaScript
- Built on NodeJS
- Easy to adjust settings via settings.js
- .env file functionality

##### Adjustable Settings:

These settings make it easy quickly adjust your CMS. As I update this CMS, these settings may change, but I will keep this **README** updated as I do. You can find the *settings.js* file in */www/lib/*.

- **port**: This is the default port that the cms will run on. By default it is set to 3000. If this is omitted it will fall back to 3000.
- **mode**: This is the default mode the cms will run in. You have two options: "development" and "production". If this is omitted it will default to development.
- **logo**: This allows you to set the url of your logo if you should want to. It gives some personalization to the CMS.
- **logo_alt**: This allows you to assign the alt attribute to your logo.
- **background_image**: This allows you to assign the background image for the CMS.


##### The Log Handler

This CMS has a log handler file that gives color to the logs to make it easier to notice what is happening. Errors are red, info is cyan, etc. The file is located in */www/lib/* if you want to make any changes to what is displayed. This is done by utilizing the log handler function.

By default:

- **error**: red background / white text
- **info**: cyan text
- **warning**: yellow text
- **general**: blue text

*Function:*
`loghandler(log, message)`

*Example use:*
`loghandler('warning', "This is a warning")`

##### The Views

The views in the CMS utilize Pug as the view engine. You can access the views templates within */www/routes/views/* if you want to make any changes. The styling in the views is helped by utilizing the [Bootstrap](https://getbootstrap.com/) library. The local css file can be found in */www/public/css/* if you want to make changes there as well.