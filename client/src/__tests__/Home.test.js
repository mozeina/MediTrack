import { MemoryRouter } from "react-router-dom";
import React, { act } from "react";  
import Home from "../components/Home";
import { render, screen, waitFor } from "@testing-library/react";

describe("home", () => {
    describe("basics", () => {
        it("shows homepage on render", async () => {
            act(() => {
                render(
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                )
            })

            await waitFor(() => {
                expect(screen.getByText('Track your meditation journey to mindfulness.')).toBeInTheDocument();
                expect(screen.getByText('Getting Started')).toBeInTheDocument();

            });
        })
    })
});