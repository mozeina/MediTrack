import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Login from "../components/Login";
import React, { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import HeaderContext from "../context/HeaderContext";
//for redux 
import { Provider } from "react-redux";
import store from "../store";

describe("login", () => {

    const mockSetHeaderUpdate = () => { };

    describe("basics", () => {
        it("shows login form on load", async () => {
            act(() => {
                render(
                    <Provider store={store}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate} >
                            <MemoryRouter>
                                <Login />
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </Provider>
                )
            })

            await waitFor(() => {
                expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
                expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
            })

        })

    })


    describe("success", () => {
        let mock;

        beforeEach(() => {
            mock = new MockAdapter(axios);
        })

        afterEach(() => {
            mock.reset();
        })

        it("shows success message when login is successful", async () => {
            mock.onPost("http://localhost:7777/users/login").reply(200, { "message": "logged in suc" });

            act(() => {
                render(
                    <Provider store={store}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate} >
                            <MemoryRouter>
                                <Login />
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </Provider>
                )
            })

            await act(async () => {

                userEvent.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
                userEvent.type(screen.getByPlaceholderText("Password"), "testpassword");

                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Login successful")).toBeInTheDocument();
            })
        })
    })

    describe("errors", () => {
        let mock;
        beforeEach(() => {
            mock = new MockAdapter(axios);
        })
        afterEach(() => {
            mock.reset();
        })

        it("shows error when server error occurs", async () => {
            act(() => {
                render(
                    <Provider store={store}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate} >
                            <MemoryRouter>
                                <Login />
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </Provider>
                )
            })

            await act(async () => {

                userEvent.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
                userEvent.type(screen.getByPlaceholderText("Password"), "testpassword");

                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Internal server error.")).toBeInTheDocument();
            })

        })

        it("shows error when user doesn't exist", async () => {

            mock.onPost("http://localhost:7777/users/login").reply(404, { "error": "user not exist" });

            act(() => {
                render(
                    <Provider store={store}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate} >
                            <MemoryRouter>
                                <Login />
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </Provider>
                )
            });


            await act(async () => {
                userEvent.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
                userEvent.type(screen.getByPlaceholderText("Password"), "testpassword");

                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("user not exist")).toBeInTheDocument();
            })


        });

        it("shows error when incorrect password", async () => {

            mock.onPost("http://localhost:7777/users/login").reply(401, { "error": "incorrect pass" });

            act(() => {
                render(
                    <Provider store={store}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate} >
                            <MemoryRouter>
                                <Login />
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </Provider>
                )
            });


            await act(async () => {
                userEvent.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
                userEvent.type(screen.getByPlaceholderText("Password"), "testpassword");

                userEvent.click(screen.getByTestId("log-in-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("incorrect pass")).toBeInTheDocument();
            })

        })
    })
});