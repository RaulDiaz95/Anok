package com.anok.repository;

import com.anok.model.Venue;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VenueRepository extends JpaRepository<Venue, UUID> {

    @Query(
            value = """
                SELECT * FROM venues
                WHERE name ILIKE CONCAT('%', :query, '%')
                ORDER BY usage_count DESC,
                         similarity(name, :query) DESC NULLS LAST,
                         verified DESC,
                         name ASC
                LIMIT 20
                """,
            nativeQuery = true
    )
    List<Venue> searchBasic(@Param("query") String query);

    @Query(
            value = """
                SELECT v.*,
                       (similarity(v.name, :query) * 3
                        + COALESCE(NULLIF(similarity(v.city, COALESCE(:city, '')),0),0)
                        + COALESCE(NULLIF(similarity(v.state, COALESCE(:state, '')),0),0)
                        + CASE WHEN v.verified THEN 0.5 ELSE 0 END
                        + LEAST(v.usage_count, 100) * 0.01
                       ) AS score
                FROM venues v
                WHERE v.name ILIKE CONCAT('%', :query, '%')
                   OR v.city ILIKE CONCAT('%', :query, '%')
                   OR v.state ILIKE CONCAT('%', :query, '%')
                ORDER BY score DESC, v.usage_count DESC, v.verified DESC, v.name ASC
                LIMIT 20
                """,
            nativeQuery = true
    )
    List<Venue> searchRanked(@Param("query") String query, @Param("city") String city, @Param("state") String state);

    Optional<Venue> findByNameIgnoreCaseAndCityIgnoreCaseAndStateIgnoreCaseAndCountryIgnoreCase(
            String name,
            String city,
            String state,
            String country
    );

    Optional<Venue> findFirstByNameIgnoreCaseOrderByUsageCountDesc(String name);

    @Modifying
    @Query("update Venue v set v.usageCount = v.usageCount + 1, v.verified = CASE WHEN v.createdByAdmin = true THEN true ELSE v.verified END where v.id = :id")
    void incrementUsage(@Param("id") UUID id);

    List<Venue> findAllByOrderByUsageCountDesc(Pageable pageable);

    @Query("SELECT v FROM Venue v ORDER BY v.createdAt DESC")
    List<Venue> findRecent(Pageable pageable);

    List<Venue> findByVerifiedFalseOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT v FROM Venue v JOIN Event e ON e.selectedVenue = v WHERE e.status = com.anok.model.EventStatus.APPROVED AND e.eventDate >= :fromDate ORDER BY v.usageCount DESC")
    List<Venue> findUsedLast30Days(@Param("fromDate") LocalDate fromDate);

    @Query("""
            SELECT v FROM Venue v
            JOIN Event e ON e.selectedVenue = v
            WHERE e.status = com.anok.model.EventStatus.APPROVED
              AND e.eventDate >= :fromDate
            GROUP BY v.id
            ORDER BY COUNT(e.id) DESC, v.usageCount DESC
            """)
    List<Venue> findPopularLast60Days(@Param("fromDate") LocalDate fromDate, Pageable pageable);

    @Query("""
            SELECT DISTINCT v FROM Venue v
            JOIN Event e ON e.selectedVenue = v
            WHERE e.owner.id = :ownerId
            """)
    List<Venue> findUserHistory(@Param("ownerId") UUID ownerId);

    List<Venue> findByVerifiedTrueOrderByUsageCountDesc(Pageable pageable);

    @Query("""
            SELECT DISTINCT v FROM Venue v
            WHERE v.city IN (
              SELECT DISTINCT v2.city FROM Venue v2
              JOIN Event e ON e.selectedVenue = v2
              WHERE e.owner.id = :ownerId
            )
            OR v.state IN (
              SELECT DISTINCT v3.state FROM Venue v3
              JOIN Event e2 ON e2.selectedVenue = v3
              WHERE e2.owner.id = :ownerId
            )
            """)
    List<Venue> findNearUser(@Param("ownerId") UUID ownerId, Pageable pageable);

    long countByVerifiedTrue();

    long countByVerifiedFalse();
}
