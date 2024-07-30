# Route Diagrams

## Register Account

![Register Account](<img/Register Account.jpg>)

## Account Login

![Account Login](<img/Login Account.jpg>)

## Change Password

![Change Password](<img/Change Password.jpg>)

## Get Favourites

![Get Favourites](<img/Get Favourites.jpg>)

## Add Favourite

![Add Favourite](<img/Add Favourite.jpg>)

## Remove Favourite

![Remove Favourite](<img/Remove Favourite.jpg>)

# Kanban

![Kanban](img/Kanban.jpg)

# User Story Breakdown

![Story Breakdown](<img/Story Breakdown.png>)

# Business Layer User Stories & Domain Models

## User Story 1

As the Business Layer,
I want to validate incoming account details,
So that invalid details are not saved to the system

| Objects          | Properties | Messages                         | Output |
| ---------------- | ---------- | -------------------------------- | ------ |
| AccountValidator |            | validateAccountDetails(req, res) | @Void  |

## User Story 2

As the Business Layer,
I want to send a 400 response if account details are invalid,
So that the Presentation Layer knows that registration details where invalid

| Objects          | Properties | Messages                         | Output |
| ---------------- | ---------- | -------------------------------- | ------ |
| AccountValidator |            | validateAccountDetails(req, res) | @Void  |

## User Story 3

As the Business Layer,
I want to add new details to the database if registration details are valid,
So that the account details can be saved

| Objects           | Properties | Messages                           | Output |
| ----------------- | ---------- | ---------------------------------- | ------ |
| AccountController |            | registerAccount(req, res)          | @Void  |
| AccountService    |            | registerAccount(accountDetails...) | @Void  |

## User Story 4

As the Business Layer,
I want to send a 500 response if the database could not be accessed during a registration request,
So that the Presentation Layer knows that the database cannot be accessed

| Objects           | Properties | Messages                  | Output |
| ----------------- | ---------- | ------------------------- | ------ |
| AccountController |            | registerAccount(req, res) | @Void  |

## User Story 5

As the Business Layer,
I want to send a 409 response if an account with the same email address already exists,
So that the Presentation Layer knows that an account with this email already exists

| Objects           | Properties | Messages                  | Output |
| ----------------- | ---------- | ------------------------- | ------ |
| AccountController |            | registerAccount(req, res) | @Void  |

## User Story 6

As the Business Layer,
I want to send a 200 response if the database added the registration details,
So that the Presentation Layer knows the request was successful

| Objects           | Properties | Messages                  | Output |
| ----------------- | ---------- | ------------------------- | ------ |
| AccountController |            | registerAccount(req, res) | @Void  |

## User Story 7

As the Business Layer,
I want to retrieve account details from the database during a request to log-in,
So that I can check given log-in details match an account

| Objects           | Properties                     | Messages                           | Output |
| ----------------- | ------------------------------ | ---------------------------------- | ------ |
| AccountController | accountService @AccountService | loginWithDetails(req, res)         | @Void  |
| AccountService    |                                | getAccountByIdentifier(identifier) | @Void  |

## User Story 8

As the Business Layer,
I want to send a 400 response if no matching account was found during a log-in request,
So that the Presentation Layer knows that the log-in details where incorrect

| Objects           | Properties                     | Messages                   | Output |
| ----------------- | ------------------------------ | -------------------------- | ------ |
| AccountController | accountService @AccountService | loginWithDetails(req, res) | @Void  |

## User Story 9

As the Business Layer,
I want to send a 500 response if the database sends no response during a log-in request,
So that the Presentation Layer knows there are issues with the database

| Objects           | Properties                     | Messages                   | Output |
| ----------------- | ------------------------------ | -------------------------- | ------ |
| AccountController | accountService @AccountService | loginWithDetails(req, res) | @Void  |

## User Story 10

As the Business Layer,
I want to send a 200 response with account details if the log-in details matched an account,
So that the Presentation Layer knows log-in was successful and can retain account info for authentication

| Objects           | Properties                     | Messages                   | Output |
| ----------------- | ------------------------------ | -------------------------- | ------ |
| AccountController | accountService @AccountService | loginWithDetails(req, res) | @Void  |

## User Story 11

As the Business Layer,
I want to authenticate requests which are only available to requests with certain privileges,
So that requests without those privileges are not given unauthorised access

| Objects          | Properties | Messages                | Output |
| ---------------- | ---------- | ----------------------- | ------ |
| AccountValidator |            | validateToken(req, res) | @Void  |

## User Story 12

As the Business Layer,
I want to send a 401 response if a request is not authorised,
So that the Presentation Layer knows that the request was not authorised

| Objects          | Properties | Messages                | Output |
| ---------------- | ---------- | ----------------------- | ------ |
| AccountValidator |            | validateToken(req, res) | @Void  |

## User Story 13

As the Business Layer,
I want to authenticate a request to change an accounts password,
So that no account is edited if the request is not authorised

| Objects          | Properties | Messages                | Output |
| ---------------- | ---------- | ----------------------- | ------ |
| AccountValidator |            | validateToken(req, res) | @Void  |
| AccountRouter    |            | initializeRoutes()      | @Void  |

## User Story 14

As the Business Layer,
I want to retrieve account details from the database during a request to change password,
So that I can modify the correct account

| Objects           | Properties                     | Messages                 | Output |
| ----------------- | ------------------------------ | ------------------------ | ------ |
| AccountController | accountService @AccountService | changePassword(req, res) | @Void  |
| AccountService    |                                | getAccountById(id)       | @Void  |

## User Story 15

As the Business Layer,
I want to send a 400 response if no matching account was found during a password change request,
So that the Presentation Layer knows that the user details where incorrect

| Objects           | Properties                     | Messages                 | Output |
| ----------------- | ------------------------------ | ------------------------ | ------ |
| AccountController | accountService @AccountService | changePassword(req, res) | @Void  |

## User Story 16

As the Business Layer,
I want to send a 500 response if the database sends no response during a password change request,
So that the Presentation Layer knows there are issues with the database

| Objects           | Properties                     | Messages                 | Output |
| ----------------- | ------------------------------ | ------------------------ | ------ |
| AccountController | accountService @AccountService | changePassword(req, res) | @Void  |

## User Story 17

As the Business Layer,
I want to modify the password of the account returned by the database during a password change request,
So that the request can be fulfilled

| Objects           | Properties                     | Messages                            | Output |
| ----------------- | ------------------------------ | ----------------------------------- | ------ |
| AccountController | accountService @AccountService | changePassword(req, res)            | @Void  |
| AccountService    |                                | changeAccountPassword(id, password) | @Void  |

## User Story 18

As the Business Layer,
I want to send a 200 response if the account password was successfully modified,
So that the Presentation Layer knows that the password was modified

| Objects           | Properties                     | Messages                 | Output |
| ----------------- | ------------------------------ | ------------------------ | ------ |
| AccountController | accountService @AccountService | changePassword(req, res) | @Void  |

## User Story 19

As the Business Layer,
I want to authenticate a request to add a location to a users list of favourites,
So that no account is edited if the request is unauthorised

| Objects          | Properties | Messages                | Output |
| ---------------- | ---------- | ----------------------- | ------ |
| AccountValidator |            | validateToken(req, res) | @Void  |
| AccountRouter    |            | initializeRoutes()      | @Void  |

## User Story 20

As the Business Layer,
I want to retrieve account details from the database during a request to add a favourite,
So that I can modify the correct account

| Objects           | Properties                     | Messages                | Output |
| ----------------- | ------------------------------ | ----------------------- | ------ |
| AccountController | accountService @AccountService | pushFavourite(req, res) | @Void  |
| AccountService    |                                | getAccountById(id)      | @Void  |

## User Story 21

As the Business Layer,
I want to send a 400 response if no matching account was found during a request to add a favourite,
So that the Presentation Layer knows that the user details where incorrect

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | pushFavourite(req, res) | @Void  |

## User Story 22

As the Business Layer,
I want to send a 500 response if the database sends no response during a request to add a favourite,
So that the Presentation Layer knows there are issues with the database

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | pushFavourite(req, res) | @Void  |

## User Story 23

As the Business Layer,
I want to add a favourite location to the account returned by the database,
So that the request can be fulfilled

| Objects           | Properties                     | Messages                   | Output |
| ----------------- | ------------------------------ | -------------------------- | ------ |
| AccountController | accountService @AccountService | pushFavourite(req, res)    | @Void  |
| AccountService    |                                | addFavourite(id, location) | @Void  |

## User Story 24

As the Business Layer,
I want to send a 200 response if the location was added to the accounts favourite list,
So that the Presentation Layer knows that the list was updated

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | pushFavourite(req, res) | @Void  |

## User Story 25

As the Business Layer,
I want to authenticate a request to remove a location from a users list of favourites,
So that no account is edited if the request is unauthorised

| Objects          | Properties | Messages                | Output |
| ---------------- | ---------- | ----------------------- | ------ |
| AccountValidator |            | validateToken(req, res) | @Void  |
| AccountRouter    |            | initializeRoutes()      | @Void  |

## User Story 26

As the Business Layer,
I want to retrieve account details from the database during a request to remove a favourite,
So that I can modify the correct account

| Objects           | Properties                     | Messages                | Output |
| ----------------- | ------------------------------ | ----------------------- | ------ |
| AccountController | accountService @AccountService | pullFavourite(req, res) | @Void  |
| AccountService    |                                | getAccountById(id)      | @Void  |

## User Story 27

As the Business Layer,
I want to send a 400 response if no matching account was found during a request to remove a favourite,
So that the Presentation Layer knows that the user details where incorrect

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | pullFavourite(req, res) | @Void  |

## User Story 28

As the Business Layer,
I want to send a 500 response if the database sends no response during a request to remove a favourite,
So that the Presentation Layer knows there are issues with the database

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | pullFavourite(req, res) | @Void  |

## User Story 29

As the Business Layer,
I want to remove a favourite location from the account returned by the database,
So that the request can be fulfilled

| Objects           | Properties                     | Messages                      | Output |
| ----------------- | ------------------------------ | ----------------------------- | ------ |
| AccountController | accountService @AccountService | pullFavourite(req, res)       | @Void  |
| AccountService    |                                | removeFavourite(id, location) | @Void  |

## User Story 30

As the Business Layer,
I want to send a 200 response if the location was removed from the accounts favourite list,
So that the Presentation Layer knows that the list was updated

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | pullFavourite(req, res) | @Void  |

## User Story 31

As the Business Layer,
I want to authenticate a request to see a users list of favourites,
So that no data is returned if the request is unauthorised

| Objects          | Properties | Messages                | Output |
| ---------------- | ---------- | ----------------------- | ------ |
| AccountValidator |            | validateToken(req, res) | @Void  |
| AccountRouter    |            | initializeRoutes()      | @Void  |

## User Story 32

As the Business Layer,
I want to retrieve account details from the database during a request to get all favourites,
So that I can identify the correct account

| Objects           | Properties                     | Messages                | Output |
| ----------------- | ------------------------------ | ----------------------- | ------ |
| AccountController | accountService @AccountService | getFavourites(req, res) | @Void  |
| AccountService    |                                | getAccountById(id)      | @Void  |

## User Story 33

As the Business Layer,
I want to send a 400 response if no matching account was found during a request to get all favourites,
So that the Presentation Layer knows that the user details where incorrect

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | getFavourites(req, res) | @Void  |

## User Story 34

As the Business Layer,
I want to send a 500 response if the database sends no response during a request to get all favourites,
So that the Presentation Layer knows there are issues with the database

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | getFavourites(req, res) | @Void  |

## User Story 35

As the Business Layer,
I want to send a 200 response along with all favourites if a matching account was found,
So that the Presentation Layer can receive the list

| Objects           | Properties | Messages                | Output |
| ----------------- | ---------- | ----------------------- | ------ |
| AccountController |            | getFavourites(req, res) | @Void  |

# Generative AI

## Domain Model Generation

![Domain Model Prompt](<img/AI Domain Model.jpg>)