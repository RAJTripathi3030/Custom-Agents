"""
Base agent class — all agent runners should follow this interface.
Ensures consistent input validation and output formatting across agents.
"""
from abc import ABC, abstractmethod
from typing import Any


class BaseAgent(ABC):
    """
    Abstract base for all Hubble agents.

    Each agent module should implement run() which takes
    validated inputs and returns structured output.
    """

    @abstractmethod
    def run(self, **kwargs) -> Any:
        """Execute the agent. Input must be pre-validated by the router."""
        raise NotImplementedError

    def format_output(self, result: Any) -> dict:
        """
        Wrap agent result in a standard output dict.
        Override to add agent-specific metadata.
        """
        return {"result": result}
