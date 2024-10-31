import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import Profile from "../components/Profile";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
//username state 
import { Provider } from "react-redux";
//for mockStore
import { configureStore } from "@reduxjs/toolkit";
import usernameSlice from "../slices/usernameSlice";
//for multiple components
import { Routes, Route } from "react-router-dom";
import GettingStarted from "../components/GettingStarted";

//child components of profile
import LatestSession from "../components/Profile/LatestSession";
import WeeklyProgress from "../components/Profile/WeeklyProgress";
import MonthlyProgress from "../components/Profile/MonthlyProgress";
//contexts
import HeaderContext from "../context/HeaderContext";
import LevelUpContext from "../context/LevelUpContext";



describe("profile component", () => {
    describe("basics", () => {
        let mockStore = configureStore({
            reducer: {
                username: usernameSlice
            },
            preloadedState: {
                username: {
                    username: "testuser"
                }
            }
        });

        let mockAxios;
        const mockSetHeaderUpdate = jest.fn();
        const mockSetLevelUp = jest.fn();

        beforeEach(() => {
            mockAxios = new MockAdapter(axios);
            window.scrollTo = jest.fn();

        });

        afterEach(() => {
            mockAxios.reset();
        })

        // we will get back to this later innit
        // it ("redirects to login if username is not found??", () => {});

        it("redirects to getting started if users' level is null", async () => {
            mockAxios.onGet("https://meditrack-bw3b.onrender.com/checkAuth").reply(200, { "mesasge": "authorized" });
            mockAxios.onGet("https://meditrack-bw3b.onrender.com/level/check-level").reply(200, null);


            render(
                <Provider store={mockStore}>
                    <LevelUpContext.Provider value={{ setLevelUpdate: mockSetLevelUp }}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate}>
                            <MemoryRouter initialEntries={['/']}>
                                <Routes>
                                    <Route path="/" element={<Profile />} />
                                    <Route path="/getting-started" element={<GettingStarted />} />
                                </Routes>
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </LevelUpContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                // screen.debug();
            })
        });

        it("renders dashboard on authCheck and Level check", async () => {

            mockAxios.onGet("https://meditrack-bw3b.onrender.com/checkAuth").reply(200, { "mesasge": "authorized" });
            mockAxios.onGet("https://meditrack-bw3b.onrender.com/level/check-level").reply(200, "yay we got a level");

            render(
                <Provider store={mockStore}>
                    <LevelUpContext.Provider value={{ setLevelUpdate: mockSetLevelUp }}>
                        <HeaderContext.Provider value={mockSetHeaderUpdate}>
                            <MemoryRouter>
                                <Profile />
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </LevelUpContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.getByText("testuser's Dashboard")).toBeInTheDocument();
            })
        });
    });
    describe("latest session", () => {

        let mockStore = configureStore({
            reducer: {
                username: usernameSlice
            },
            preloadedState: {
                username: {
                    username: "testuser"
                }
            }
        });

        let mockAxios;
        const mockSetHeaderUpdate = jest.fn();

        beforeEach(() => {
            mockAxios = new MockAdapter(axios);
            window.scrollTo = jest.fn();

        });

        afterEach(() => {
            mockAxios.reset();
        })

        it("renders loading div while waiting for fetch", async () => {
            render(
                <Provider store={mockStore}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <LatestSession />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )
            await waitFor(() => {
                expect(screen.getByTestId("small-loader-latest-session")).toBeInTheDocument();
            })
        })

        it("shows that no prev session exists after fetch when no session exists", async () => {

            mockAxios.onGet("https://meditrack-bw3b.onrender.com/session/get-latest-session").reply(200, {
                minutes: 0,
                date: 0
            })

            render(
                <Provider store={mockStore}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <LatestSession />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )
            await waitFor(() => {
                expect(screen.queryByTestId("small-loader-latest-session")).not.toBeInTheDocument();
            })

            expect(screen.getByText("You have no previous sessions.")).toBeInTheDocument();

        })

        it("shows latest session when latest session exists", async () => {
            mockAxios.onGet("https://meditrack-bw3b.onrender.com/session/get-latest-session").reply(200, {
                minutes: 3443,
                date: 1727643053881
            })

            render(
                <Provider store={mockStore}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <LatestSession />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.queryByTestId("small-loader-latest-session")).not.toBeInTheDocument();
            })

            expect(screen.getByText("3443")).toBeInTheDocument();
            expect(screen.getByText("minutes")).toBeInTheDocument();
            expect(screen.getByText("Sunday 29/9 at 21:50")).toBeInTheDocument();
        })

    });

    describe("weekly progress", () => {

        let mockStore = configureStore({
            reducer: {
                username: usernameSlice
            },
            preloadedState: {
                username: {
                    username: "testuser"
                }
            }
        });

        let mockAxios;
        const mockSetHeaderUpdate = jest.fn();

        beforeEach(() => {
            mockAxios = new MockAdapter(axios);
            window.scrollTo = jest.fn();

        });

        afterEach(() => {
            mockAxios.reset();
        })

        it("shows loading when loading weekly progress", async () => {
            render(
                <Provider store={mockStore}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <WeeklyProgress />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.getByTestId("small-loader-weekly-progress")).toBeInTheDocument();
            })


        });

        it("shows weekly progress for each day depending on the day of the week", async () => {
            let mockWeeklyProgress = {
                monday: 0,
                tuesday: 100,
                wednesday: 43,
                thursday: 44,
                friday: 4,
                saturday: 3,
                sunday: 10
            }

            mockAxios.onGet("https://meditrack-bw3b.onrender.com/session/get-weekly-progress").reply(200, mockWeeklyProgress);

            let day = new Date().getDay();

            let existingWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].slice(0, day ? day : 7);

            render(
                <Provider store={mockStore}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <WeeklyProgress />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.queryByTestId("small-loader-weekly-progress")).not.toBeInTheDocument();
            })

            existingWeek.forEach(day => {
                // expect(screen.getByText(day)).toBeInTheDocument();
                let dayLower = day[0].toLowerCase() + day.slice(1);
                let activity = mockWeeklyProgress[dayLower] ? `${mockWeeklyProgress[dayLower]} mins` : "No activity";
                expect(screen.getByText(activity)).toBeInTheDocument();
            })

        })
    })

    describe("monthly progress", () => {
        let mockStore = configureStore({
            reducer: {
                username: usernameSlice
            },
            preloadedState: {
                username: {
                    username: "testuser"
                }
            }
        });

        let mockAxios;
        const mockSetHeaderUpdate = jest.fn();

        beforeEach(() => {
            mockAxios = new MockAdapter(axios);
            window.scrollTo = jest.fn();

        });

        afterEach(() => {
            mockAxios.reset();
        })

        it("shows loader before fetching monthly progress data", async () => {

            render(
                <Provider store={mockStore}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <MonthlyProgress />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.getByTestId("small-loader-monthly-progress")).toBeInTheDocument();
            })
        })

        it("shows all monthly progress when loaded and window inner width > 1600px", async () => {
            let mockMonthlyProgress = {
                jan: 4,
                feb: 3,
                mar: 19,
                apr: 44,
                may: 5,
                jun: 90,
                jul: 443,
                aug: 0,
                sep: 1,
                oct: null,
                nov: 9,
                dec: 82
            };

            window.innerWidth = 1900;

            mockAxios.onGet("https://meditrack-bw3b.onrender.com/session/get-monthly-progress").reply(200, mockMonthlyProgress);
            render(
                <Provider store={mockStore}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <MonthlyProgress />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.queryByTestId("small-loader-monthly-progress")).not.toBeInTheDocument();
            })


            expect(screen.getByText("Jan")).toBeInTheDocument();
            expect(screen.getByText("4 hrs")).toBeInTheDocument();

            expect(screen.getByText("May")).toBeInTheDocument();
            expect(screen.getByText("5 hrs")).toBeInTheDocument();

            expect(screen.queryByText("Oct")).not.toBeInTheDocument();
            //here we gotta add No activity
            expect(screen.getByText(/No\s*activity/)).toBeInTheDocument();



        })

        it("shows last 5 months of monthly progress when loaded and window inner width <= 1600px", async () => {
            let mockMonthlyProgress = {
                jan: 4,
                feb: 3,
                mar: 19,
                apr: 44,
                may: 5,
                jun: 90,
                jul: 443,
                aug: 0,
                sep: 1,
                oct: null,
                nov: 9,
                dec: 82
            };

            window.innerWidth = 1000;

            mockAxios.onGet("https://meditrack-bw3b.onrender.com/session/get-monthly-progress").reply(200, mockMonthlyProgress);
            render(
                <Provider store={mockStore}>
                    <HeaderContext.Provider value={mockSetHeaderUpdate}>
                        <MemoryRouter>
                            <MonthlyProgress />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </Provider>
            )

            await waitFor(() => {
                expect(screen.queryByTestId("small-loader-monthly-progress")).not.toBeInTheDocument();
            })

            expect(screen.queryByText("Jan")).not.toBeInTheDocument();
            expect(screen.queryByText("4 hrs")).not.toBeInTheDocument();

            expect(screen.queryByText("May")).not.toBeInTheDocument();
            expect(screen.queryByText("5 hrs")).not.toBeInTheDocument();

            expect(screen.getByText("Jul")).toBeInTheDocument();
            expect(screen.getByText("443 hrs")).toBeInTheDocument();


        })
    })
});