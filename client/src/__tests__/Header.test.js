import { screen, render, waitFor } from "@testing-library/react";
import React, { act } from "react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header";
import HeaderContext from "../context/HeaderContext";
import { Provider } from "react-redux";
import store from "../store";

describe("header", () => {

    let mockHeaderUpdate = {};
    let setMockHeaderUpdate = () => { };
    //basics
    describe("basics", () => {
        it("shows page title on load", async () => {
            act(() => {
                render(
                    <Provider store={store}>
                        <HeaderContext.Provider value={{ mockHeaderUpdate, setMockHeaderUpdate }}>
                            <MemoryRouter>
                                <Header />
                            </MemoryRouter>
                        </HeaderContext.Provider>
                    </Provider>
                )
            })

            await waitFor(() => {
                expect(screen.getByText("MediTrack")).toBeInTheDocument();
            })
        }),
            it("shows navbar", async () => {
                act(() => {
                    render(
                        <Provider store={store}>
                            <HeaderContext.Provider value={{ mockHeaderUpdate, setMockHeaderUpdate }}>
                                <MemoryRouter>
                                    <Header />
                                </MemoryRouter>
                            </HeaderContext.Provider>
                        </Provider>
                    )
                });

                await waitFor(() => {
                    expect(screen.getByText("Home")).toBeInTheDocument();
                    expect(screen.getByText("About us")).toBeInTheDocument();
                })
            })
    })
})