import React, { act, useState } from "react";
import Signup from "../components/Signup";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import HeaderContext from "../context/HeaderContext";


describe("sign up", () => {
    let mockSetHeaderUpdate = jest.fn();
    describe("basics", () => {
        it("shows signup page on render", async () => {
            let HeaderContextProvider = ({ children }) => {
                let [headerUpdate, setHeaderUpdate] = useState(false);
                return (
                    <HeaderContext.Provider value={{ headerUpdate, setHeaderUpdate }}>
                        {children}
                    </HeaderContext.Provider>
                )
            }

            act(() => {
                render(
                    <HeaderContextProvider>
                        <MemoryRouter>
                            <Signup />
                        </MemoryRouter>
                    </HeaderContextProvider>
                )
            })

            await waitFor(() => {
                expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
                expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
            })
        });
    })

    describe("success", () => {
        let mock;

        beforeEach(() => {
            mock = new MockAdapter(axios);
        });
        afterEach(() => {
            mock.reset();
        });

        it("shows success message on successful registration", async () => {
            mock.onPost("http://localhost:7777/users/register").reply(201, { "message": "test" });

            act(() => {
                render(
                    <HeaderContext.Provider value={mockSetHeaderUpdate} >
                        <MemoryRouter>
                            <Signup />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByPlaceholderText("Username"), "username");
                userEvent.type(screen.getByPlaceholderText("Email"), "goodemail@gmail.com");
                userEvent.type(screen.getByPlaceholderText("Password"), "password");
                userEvent.type(screen.getByPlaceholderText("Confirm password"), "password");

                userEvent.click(screen.getByTestId("sign-up-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Account created successfully.")).toBeInTheDocument();
            })
        })
    })
    describe("errors", () => {
        let mock;

        beforeEach(() => {
            mock = new MockAdapter(axios);
        });
        afterEach(() => {
            mock.reset();
        });

        it("shows error when provided passwords dont match", async () => {
            act(() => {
                render(
                    <HeaderContext.Provider value={mockSetHeaderUpdate} >
                        <MemoryRouter>
                            <Signup />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByPlaceholderText("Username"), "username");
                userEvent.type(screen.getByPlaceholderText("Email"), "goodemail@gmail.com");
                userEvent.type(screen.getByPlaceholderText("Password"), "password");
                userEvent.type(screen.getByPlaceholderText("Confirm password"), "passwor");

                userEvent.click(screen.getByTestId("sign-up-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Provided passwords do not match.")).toBeInTheDocument();
            })
        })

        it("shows error when username is less than 3 characters ", async () => {
            mock.onPost("http://localhost:7777/users/register").reply(400, { "errors": [{ msg: "bad username" }] });

            act(() => {
                render(
                    <HeaderContext.Provider value={mockSetHeaderUpdate} >
                        <MemoryRouter>
                            <Signup />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByPlaceholderText("Username"), "us");
                userEvent.type(screen.getByPlaceholderText("Email"), "goodemail@gmail.com");
                userEvent.type(screen.getByPlaceholderText("Password"), "password");
                userEvent.type(screen.getByPlaceholderText("Confirm password"), "password");

                userEvent.click(screen.getByTestId("sign-up-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("bad username")).toBeInTheDocument();
            })
        })

        it("shows error when email is an invalid email format", async () => {
            mock.onPost("http://localhost:7777/users/register").reply(400, { "errors": [{ msg: "INVALID EMAIL" }] });

            act(() => {
                render(
                    <HeaderContext.Provider value={mockSetHeaderUpdate} >
                        <MemoryRouter>
                            <Signup />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByPlaceholderText("Username"), "username");
                userEvent.type(screen.getByPlaceholderText("Email"), "bad-email-format");
                userEvent.type(screen.getByPlaceholderText("Password"), "password");
                userEvent.type(screen.getByPlaceholderText("Confirm password"), "password");

                userEvent.click(screen.getByTestId("sign-up-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("INVALID EMAIL")).toBeInTheDocument();
                expect(screen.queryByText("Account created successfully.")).not.toBeInTheDocument();
            })
        })

        it("shows error when password is less than 6 characters OR has spaces", async () => {
            mock.onPost("http://localhost:7777/users/register").reply(400, { "errors": [{ msg: "NO SPACES IN PASSWORD" }, { msg: "LONGER PASSWORD" }] });

            act(() => {
                render(
                    <HeaderContext.Provider value={mockSetHeaderUpdate} >
                        <MemoryRouter>
                            <Signup />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByPlaceholderText("Username"), "username");
                userEvent.type(screen.getByPlaceholderText("Email"), "goodemail@gmail.com");
                userEvent.type(screen.getByPlaceholderText("Password"), "pa as");
                userEvent.type(screen.getByPlaceholderText("Confirm password"), "pa as");

                userEvent.click(screen.getByTestId("sign-up-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("NO SPACES IN PASSWORD")).toBeInTheDocument();
                expect(screen.getByText("LONGER PASSWORD")).toBeInTheDocument();

                expect(screen.queryByText("Account created successfully.")).not.toBeInTheDocument();
            })
        })

        it("shows all http request errors at once/together", async () => {
            mock.onPost("http://localhost:7777/users/register").reply(400, { "errors": [{ msg: "NO SPACES IN PASSWORD" }, { msg: "LONGER PASSWORD" }, { msg: "LONGER USERNAME" }, { msg: "PROPER EMAIL" }] });

             let HeaderContextProvider = ({ children }) => {
                let [headerUpdate, setHeaderUpdate] = useState(false);
                return (
                    <HeaderContext.Provider value={{ headerUpdate, setHeaderUpdate }}>
                        {children}
                    </HeaderContext.Provider>
                )
            }
            
            act(() => {
                render(
                    <HeaderContextProvider>
                        <MemoryRouter>
                            <Signup />
                        </MemoryRouter>
                    </HeaderContextProvider>
                )
            })

            await act(async () => {
                userEvent.type(screen.getByPlaceholderText("Username"), "us");
                userEvent.type(screen.getByPlaceholderText("Email"), "very-bad-email");
                userEvent.type(screen.getByPlaceholderText("Password"), "pa as");
                userEvent.type(screen.getByPlaceholderText("Confirm password"), "pa as");

                userEvent.click(screen.getByTestId("sign-up-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("NO SPACES IN PASSWORD")).toBeInTheDocument();
                expect(screen.getByText("LONGER PASSWORD")).toBeInTheDocument();
                expect(screen.getByText("LONGER USERNAME")).toBeInTheDocument();
                expect(screen.getByText("PROPER EMAIL")).toBeInTheDocument();

                expect(screen.queryByText("Account created successfully.")).not.toBeInTheDocument();
            })
        })

    });
})