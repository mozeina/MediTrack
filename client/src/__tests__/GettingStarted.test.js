import GettingStarted from "../components/GettingStarted";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
//contexts
import HeaderContext from "../context/HeaderContext";
import LevelUpContext from "../context/LevelUpContext";
//axios
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

//for redux 
import { Provider } from "react-redux";
import store from "../store";
import Profile from "../components/Profile";


describe("Getting started", () => {
    let mockSetHeaderUpdate = jest.fn();
    describe("basics", () => {
        it("shows loading screen before getting username", async () => {
            act(() => {
                render(
                    <Provider store={store}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate}>
                            <MemoryRouter>
                                <GettingStarted />
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </Provider>
                )
            })
            expect(screen.getByTestId("loader")).toBeInTheDocument();
        });

    })

    describe("including http requests", () => {

        let mock;

        beforeEach(() => {
            mock = new MockAdapter(axios);
        });

        afterEach(() => {
            mock.reset();
        });

        it("shows welcome message after login when user's level is not set", async () => {

            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "mesasge": "authorized" });
            mock.onGet("http://localhost:7777/users/get-username").reply(200, "yay nice username");

            render(
                <Provider store={store}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <GettingStarted />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
                expect(screen.getByText("Welcome, yay nice username!")).toBeInTheDocument();
            })
        })

        it("shows description of beginner level when beginner is selected", async () => {

            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "mesasge": "authorized" });
            mock.onGet("http://localhost:7777/users/get-username").reply(200, "yay nice username");

            render(
                <Provider store={store}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <GettingStarted />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )


            await waitFor(() => {
                userEvent.click(screen.getByTestId("beginner-level"));
            });

            await waitFor(() => {
                expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
                expect(screen.getByText("Welcome, yay nice username!")).toBeInTheDocument();
                expect(screen.getByText("Continue as Beginner")).toBeInTheDocument();
            });
        });

        it("shows description of experienced level when experienced is selected", async () => {

            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "mesasge": "authorized" });
            mock.onGet("http://localhost:7777/users/get-username").reply(200, "yay nice username");

            render(
                <Provider store={store}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <GettingStarted />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                userEvent.click(screen.getByTestId("experienced-level"));
            });

            await waitFor(() => {
                expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
                expect(screen.getByText("Welcome, yay nice username!")).toBeInTheDocument();
                expect(screen.getByText("Continue as Experienced")).toBeInTheDocument();
            });
        });

        it("shows description of monk level when monk is selected", async () => {

            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "mesasge": "authorized" });
            mock.onGet("http://localhost:7777/users/get-username").reply(200, "yay nice username");

            render(
                <Provider store={store}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <GettingStarted />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                userEvent.click(screen.getByTestId("monk-level"));
            });

            await waitFor(() => {
                expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
                expect(screen.getByText("Welcome, yay nice username!")).toBeInTheDocument();
                expect(screen.getByText("Continue as Monk")).toBeInTheDocument();
            });

        });

        it("redirects to /profile on button click (profile access conditions are fulfilled)", async () => {

            mock.onGet("http://localhost:7777/checkAuth").reply(200, { "mesasge": "authorized" });
            mock.onGet("http://localhost:7777/users/get-username").reply(200, "yay nice username");

            //for profile component
            mock.onGet("http://localhost:7777/level/check-level").reply(200, "yay we got a level");

            let mockSetLevelUp = jest.fn();

            render(
                <Provider store={store}>
                    <LevelUpContext.Provider value={{ setLevelUp: mockSetLevelUp }}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate}>
                            <MemoryRouter initialEntries={['/']}>
                                <Routes>
                                    <Route path="/" element={<GettingStarted />} />
                                    <Route path="/profile" element={<Profile />} />
                                </Routes>
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </LevelUpContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                userEvent.click(screen.getByTestId("experienced-level"));
            });

            await waitFor(() => {
                userEvent.click(screen.getByTestId("continue-button"));
            });

            await waitFor(() => {
                expect(screen.getByText("yay nice username's Dashboard")).toBeInTheDocument();
            })

        });
    })
});