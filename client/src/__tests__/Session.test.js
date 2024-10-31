import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { act, useState } from "react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
//components
import Session from "../components/Session";
import Login from "../components/Login";
import Profile from "../components/Profile";
//context and context function
import HeaderContext from "../context/HeaderContext";
import ErrorDivContext from "../context/ErrorDivContext";
import LevelUpContext from "../context/LevelUpContext";
//mock store for profile navigate
import { Provider } from "react-redux";
import usernameSlice from "../slices/usernameSlice";
import { configureStore } from "@reduxjs/toolkit";


describe("Session", () => {

    let mockSetHeaderUpdate = jest.fn();
    let mockSetLevelUp = jest.fn()
    let mockSetError = jest.fn();

    describe("basics", () => {
        it("shows stopwatch UI on load", async () => {
            render(
                <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>
                    <ErrorDivContext.Provider value={{ setError: mockSetError }}>
                        <HeaderContext.Provider value={{ mockSetHeaderUpdate }}>
                            <Router >
                                <Session />
                            </Router>
                        </HeaderContext.Provider>
                    </ErrorDivContext.Provider>
                </LevelUpContext.Provider>
            )
            // here the error confirmation div is rendered but with a z-index that makes it so its under the rest of the divs, clicking confirm on the test 
            // shouldn't do anything
            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
                expect(screen.getByText("Are you sure you want to cancel this session?")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByText("Confirm"));
            })
            await waitFor(() => {
                expect(screen.getByText("Are you sure you want to cancel this session?")).toBeInTheDocument();
            })
        })
    })
    describe("fetched requests", () => {
        let mock;
        beforeEach(() => {
            mock = new MockAdapter(axios);
        })
        let mockStore = configureStore({
            reducer: {
                username: usernameSlice
            },
            preloadedState: {
                username: {
                    username: "testuserlol"
                }
            }
        })

        afterEach(() => {
            mock.reset();
        })
        it("redirects to login if user isnt signed in when trying to start a session", async () => {
            mock.onGet("http://localhost:7777/checkAuth").reply(401, { "message": "unauthorized" });

            render(
                <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>
                    <ErrorDivContext.Provider value={{ setError: mockSetError }}>
                        <HeaderContext.Provider value={{ mockSetHeaderUpdate }}>
                            <Router initialEntries={["/"]} >
                                <Routes>
                                    <Route path="/" element={<Session />} />
                                    <Route path="/login" element={<Login />} />
                                </Routes>
                            </Router>
                        </HeaderContext.Provider>
                    </ErrorDivContext.Provider>
                </LevelUpContext.Provider>
            )

            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
            })

            await act(async () => {
                userEvent.click(screen.getByTestId("start-session-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("Login")).toBeInTheDocument();
            })

        })

        it("starts a session on click of start a session if user is authorized", async () => {
            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "message": "authorzied" });
            render(
                <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>

                    <ErrorDivContext.Provider value={{ setError: mockSetError }}>
                        <HeaderContext.Provider value={{ mockSetHeaderUpdate }}>
                            <Router initialEntries={["/"]} >
                                <Routes>
                                    <Route path="/" element={<Session />} />
                                    <Route path="/login" element={<Login />} />
                                </Routes>
                            </Router>
                        </HeaderContext.Provider>
                    </ErrorDivContext.Provider>
                </LevelUpContext.Provider>
            )

            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
            })

            await act(async () => {
                userEvent.click(screen.getByTestId("start-session-button"));
            })

            await waitFor(() => {
                expect(screen.getByText("End Session")).toBeInTheDocument();
            })
        });

        it("cancels session when session starts then cancel then confirm cancel", async () => {
            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "message": "authorzied" });
            render(
                <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>

                    <ErrorDivContext.Provider value={{ setError: mockSetError }}>
                        <HeaderContext.Provider value={{ mockSetHeaderUpdate }}>
                            <Router initialEntries={["/"]} >
                                <Routes>
                                    <Route path="/" element={<Session />} />
                                    <Route path="/login" element={<Login />} />
                                </Routes>
                            </Router>
                        </HeaderContext.Provider>
                    </ErrorDivContext.Provider>
                </LevelUpContext.Provider>
            )

            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("start-session-button"));
            })

            await waitFor(() => {
                expect(screen.getByTestId("pause-play")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("pause-play"));
            })

            await waitFor(() => {
                expect(screen.getByTestId("cancel-session")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("cancel-session"));
            })

            await waitFor(() => {
                expect(screen.getByText("Confirm")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByText("Confirm"));
            })

            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
            })
        })

        it("does not cancel session when user pauses then cancels then does NOT confirm cancel", async () => {
            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "message": "authorzied" });
            render(
                <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>
                    <ErrorDivContext.Provider value={{ setError: mockSetError }}>
                        <HeaderContext.Provider value={{ mockSetHeaderUpdate }}>
                            <Router initialEntries={["/"]} >
                                <Routes>
                                    <Route path="/" element={<Session />} />
                                    <Route path="/login" element={<Login />} />
                                </Routes>
                            </Router>
                        </HeaderContext.Provider>
                    </ErrorDivContext.Provider>
                </LevelUpContext.Provider>
            )

            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("start-session-button"));
            })

            await waitFor(() => {
                expect(screen.getByTestId("pause-play")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("pause-play"));
            })

            await waitFor(() => {
                expect(screen.getByTestId("cancel-session")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("cancel-session"));
            })

            await waitFor(() => {
                expect(screen.getByText("Cancel")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByText("Cancel"));
            })

            await waitFor(() => {
                expect(screen.getByText("End Session")).toBeInTheDocument();
            })
        })

        it("pause play button works as intended", async () => {
            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "message": "authorzied" });
            render(
                <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>
                    <ErrorDivContext.Provider value={{ setError: mockSetError }}>
                        <HeaderContext.Provider value={{ mockSetHeaderUpdate }}>
                            <Router initialEntries={["/"]} >
                                <Routes>
                                    <Route path="/" element={<Session />} />
                                    <Route path="/login" element={<Login />} />
                                </Routes>
                            </Router>
                        </HeaderContext.Provider>
                    </ErrorDivContext.Provider>
                </LevelUpContext.Provider>
            )

            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("start-session-button"));
            })

            await waitFor(() => {
                expect(screen.getByTestId("pause-play")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("pause-play"));
            })

            await waitFor(() => {
                expect(screen.getByTestId("pause-play")).toBeInTheDocument();
                expect(screen.getByTestId("cancel-session")).toBeInTheDocument();
                expect(screen.getByTestId("reset-button")).toBeInTheDocument();
            })

            act(() => {
                userEvent.click(screen.getByTestId("pause-play"))
            })

            await waitFor(() => {
                expect(screen.getByTestId("pause-play")).toBeInTheDocument();
                expect(screen.queryByTestId("cancel-session")).not.toBeInTheDocument();
                expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();
            })
        })

        //TEST NOT WORKING WTH skip it for now
        test("end session shows error if database fails to update / unauthorized && clicking close will remove the error div", async () => {

            // Setup proper state management for the context
            const ErrorContextProvider = ({ children }) => {
                const [error, setError] = useState(false);  // Use actual state
                return (
                    <ErrorDivContext.Provider value={{ error, setError }}>
                        {children}
                    </ErrorDivContext.Provider>
                );
            };

            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "message": "authorized" });
            mock.onPost("http://localhost:7777/session/end-session").reply(500, { "error": "server error" });

            // Use the custom provider with real state
            render(
                <Provider store={mockStore}>
                    <ErrorContextProvider>
                        <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>
                            <HeaderContext.Provider value={mockSetHeaderUpdate}>
                                <Router initialEntries={["/"]}>
                                    <Routes>
                                        <Route path="/" element={<Session />} />
                                        <Route path="/profile" element={<Profile />} />
                                    </Routes>
                                </Router>
                            </HeaderContext.Provider>
                        </LevelUpContext.Provider>
                    </ErrorContextProvider>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
            });

            userEvent.click(screen.getByTestId("start-session-button"));

            await waitFor(() => {
                expect(screen.getByText("End Session")).toBeInTheDocument();
            });

            userEvent.click(screen.getByText("End Session"));

            await waitFor(() => {
                expect(screen.getByText("An error has occured.")).toBeInTheDocument();
            });

            // userEvent.click(screen.getByText("Close"));

            // await waitFor(() => {
            //     expect(screen.queryByText("Close")).not.toBeInTheDocument();
            // 

        })

        test("successful end session navigates to profile", async () => {


            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "message": "authorzied" });
            //mock end session query
            mock.onPost("http://localhost:7777/session/end-session").reply(201, { "message": "end session succesful" });
            //mock all queries of profile
            mock.onGet("http://localhost:7777/level/check-level").reply(200, "1");


            render(
                <Provider store={mockStore}>
                    <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>
                        <ErrorDivContext.Provider value={{ setError: mockSetError }}>
                            <HeaderContext.Provider value={{ mockSetHeaderUpdate }}>
                                <Router initialEntries={["/"]} >
                                    <Routes>
                                        <Route path="/" element={<Session />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/profile" element={<Profile />} />
                                    </Routes>
                                </Router>
                            </HeaderContext.Provider>
                        </ErrorDivContext.Provider>
                    </LevelUpContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.getByText("Start Session")).toBeInTheDocument();
            })

            userEvent.click(screen.getByText("Start Session"));

            await waitFor(() => {
                expect(screen.getByTestId("pause-play")).toBeInTheDocument();
            })

            userEvent.click(screen.getByTestId("pause-play"));

            await waitFor(() => {
                expect(screen.getByText("End Session")).toBeInTheDocument();
            })

            userEvent.click(screen.getByText("End Session"));


            await waitFor(() => {
                expect(screen.getByText("testuserlol's Dashboard")).toBeInTheDocument();
            })

        })

    })
})