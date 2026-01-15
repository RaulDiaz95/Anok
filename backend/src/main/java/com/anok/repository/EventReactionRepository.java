package com.anok.repository;

import com.anok.model.EventReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventReactionRepository extends JpaRepository<EventReaction, UUID> {
    Optional<EventReaction> findByUser_IdAndEvent_Id(UUID userId, UUID eventId);
}
