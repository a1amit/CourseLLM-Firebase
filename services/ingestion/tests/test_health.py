"""Tests for health and metrics endpoints."""

import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Test the /health endpoint."""

    def test_health_returns_ok(self, client: TestClient):
        """Precondition: None
        Action: Call GET /health
        Postcondition: Response has status 200 and contains ok=true"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["ok"] is True
        assert "service" in data
        assert data["service"] == "ingestion"
        assert "version" in data

    def test_health_response_structure(self, client: TestClient):
        """Precondition: None
        Action: Call GET /health
        Postcondition: Response has required fields"""
        response = client.get("/health")
        data = response.json()
        
        required_fields = ["ok", "service", "version"]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"


class TestMetricsEndpoint:
    """Test the /metrics endpoint."""

    def test_metrics_returns_200(self, client: TestClient):
        """Precondition: None
        Action: Call GET /metrics
        Postcondition: Response has status 200"""
        response = client.get("/metrics")
        assert response.status_code == 200

    def test_metrics_response_structure(self, client: TestClient):
        """Precondition: None
        Action: Call GET /metrics
        Postcondition: Response contains CPU, memory, and disk metrics"""
        response = client.get("/metrics")
        data = response.json()
        
        # Check top-level keys
        assert "cpu" in data
        assert "memory" in data
        assert "disk" in data
        
        # Check CPU metrics
        assert "percent" in data["cpu"]
        assert 0 <= data["cpu"]["percent"] <= 100
        
        # Check memory metrics
        assert "used_mb" in data["memory"]
        assert "total_mb" in data["memory"]
        assert "percent" in data["memory"]
        assert data["memory"]["used_mb"] > 0
        assert data["memory"]["total_mb"] > 0
        assert 0 <= data["memory"]["percent"] <= 100
        
        # Check disk metrics
        assert "used_gb" in data["disk"]
        assert "total_gb" in data["disk"]
        assert "percent" in data["disk"]
        assert data["disk"]["used_gb"] >= 0
        assert data["disk"]["total_gb"] > 0
        assert 0 <= data["disk"]["percent"] <= 100

    def test_metrics_numeric_values(self, client: TestClient):
        """Precondition: None
        Action: Call GET /metrics
        Postcondition: All numeric metrics are valid numbers"""
        response = client.get("/metrics")
        data = response.json()
        
        # Validate numeric types and ranges
        assert isinstance(data["cpu"]["percent"], (int, float))
        assert isinstance(data["memory"]["used_mb"], (int, float))
        assert isinstance(data["memory"]["total_mb"], (int, float))
        assert isinstance(data["disk"]["used_gb"], (int, float))
        assert isinstance(data["disk"]["total_gb"], (int, float))
