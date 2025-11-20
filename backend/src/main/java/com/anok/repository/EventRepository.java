package com.anok.repository;

import com.anok.model.Event;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    @EntityGraph(attributePaths = {"owner", "genres"})
    List<Event> findAllByEventDateTimeAfterOrderByEventDateTimeAsc(LocalDateTime cutoff);

    @EntityGraph(attributePaths = {"owner", "genres"})
    List<Event> findAllByOrderByEventDateTimeAsc();

    @EntityGraph(attributePaths = {"owner", "genres"})
    Optional<Event> findById(UUID id);
}
