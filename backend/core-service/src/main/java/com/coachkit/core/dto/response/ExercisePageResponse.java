package com.coachkit.core.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@Schema(description = "Paginated exercises response")
public class ExercisePageResponse {

    @Schema(description = "List of exercises")
    private List<ExerciseResponse> content;

    @Schema(description = "Current page number (0-based)")
    private int page;

    @Schema(description = "Page size")
    private int size;

    @Schema(description = "Total number of elements")
    private long totalElements;

    @Schema(description = "Total number of pages")
    private int totalPages;

    @Schema(description = "Has next page")
    private boolean hasNext;

    @Schema(description = "Has previous page")
    private boolean hasPrevious;
}