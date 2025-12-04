package com.anok.repository;

import com.anok.model.Event;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.anok.model.EventStatus;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    @EntityGraph(attributePaths = {"owner", "genres", "performers"})
    List<Event> findAllByEventDateTimeAfterOrderByEventDateTimeAsc(LocalDateTime cutoff);

    @EntityGraph(attributePaths = {"owner", "genres", "performers"})
    List<Event> findAllByEventDateTimeAfterAndIsLiveTrueOrderByEventDateTimeAsc(LocalDateTime cutoff);

    @EntityGraph(attributePaths = {"owner", "genres", "performers"})
    List<Event> findAllByOrderByEventDateTimeAsc();

    @EntityGraph(attributePaths = {"owner", "genres", "performers"})
    Optional<Event> findById(UUID id);

    @EntityGraph(attributePaths = {"owner", "genres", "performers"})
    List<Event> findAllByOwner_EmailNormalizedOrderByEventDateTimeDesc(String ownerEmailNormalized);

    @EntityGraph(attributePaths = {"owner", "genres", "performers"})
    Optional<Event> findByIdAndOwner_EmailNormalized(UUID id, String ownerEmailNormalized);

    @EntityGraph(attributePaths = {"owner", "genres", "performers"})
    List<Event> findAllByStatusOrderByCreatedAtAsc(EventStatus status);
}
